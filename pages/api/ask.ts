import { createClient } from "@supabase/supabase-js";
import { createParser } from "eventsource-parser";

export const config = {
  runtime: "edge",
};

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  try {
    const { query } = (await req.json()) as { query: string };
    const response = await fetch(`https://api.openai.com/v1/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: query,
      }),
    });
    const json = await response.json();
    const embedding = json.data?.[0]?.embedding;
    const { data: chunks, error } = await supabaseClient.rpc(
      "embeddings_search",
      {
        query_embedding: embedding,
        similarity_threshold: 0.5,
        match_count: 2,
      }
    );
    if (error) {
      return new Response("Error", { status: 500 });
    }
    // return new Response(JSON.stringify(chunks), { status: 200 });

    const prompt = `
    Use the following text to answer the question: ${query}
    ${chunks.map((chunk: { content: string }) => chunk.content).join("\n")}
    `;
    const stream = await OpenAIstream(prompt);
    return new Response(stream, { status: 200 });
  } catch (e) {
    return new Response("Error", { status: 500 });
  }
};

export default handler;

const OpenAIstream = async (prompt: string) => {
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that answers queries. Response in 3-5 sentences and in markdown format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.0,
      stream: true,
    }),
  });

  if (response.status !== 200) {
    throw new Error("Error");
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const onParse: any = (event: { type: string; data: any }) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            //choices is an array of objects. We want the first object in the array. delta is an object. content is a string
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };
      const parser = createParser(onParse);
      if (response?.body)
        for await (const chunk of response?.body as any) {
          parser.feed(decoder.decode(chunk));
        }
    },
  });
  return stream;
};
