import { createClient } from "@supabase/supabase-js";
import { createParser } from "eventsource-parser";
import allowCors from "../../utils/allowCors";

export const config = {
  runtime: "edge",
};
// not using prisma as its a edge function and prisma needs proxy to work with edge
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  try {
    const { query, sources, projectId } = (await req.json()) as {
      query: string;
      sources?: boolean;
      projectId?: string;
    };
    if (!projectId)
      return allowCors(req, new Response("Error", { status: 500 }));
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
    console.log({ query });
    const json = await response.json();
    const embedding = json.data?.[0]?.embedding;
    const { data: chunks, error } = await supabaseClient.rpc(
      "embeddings_search",
      {
        project_id: projectId,
        query_embedding: embedding,
        similarity_threshold: 0.5,
        match_count: 3,
      }
    );
    if (error) {
      console.log(error);
      return allowCors(req, new Response("Error", { status: 500 }));
    }
    const prompt = `
    Use the following text to answer the question.Question is "${query}"
    ${chunks.map((chunk: { content: string }) => chunk.content).join("\n")}
    `;
    const stream = chunks?.length
      ? await OpenAIstream(
          prompt,
          sources
            ? chunks?.map((chunk: { content_url: any; content_title: any }) => {
                return {
                  url: chunk.content_url,
                  title: chunk.content_title,
                };
              })
            : undefined
        )
      : "Not able to find any answer. Please try again with a different question.";
    return allowCors(req, new Response(stream, { status: 200 }));
  } catch (e) {
    return allowCors(req, new Response("Error", { status: 500 }));
  }
};

export default handler;

const OpenAIstream = async (
  prompt: string,
  sources?: {
    url: string;
    title: string;
  }[]
) => {
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
          content: `You are a very enthusiastic representative who loves
          to help people! Given the following sections from the given
          documentation, answer the question using only that information,
          outputted in markdown format (including related code snippets if available). If you are unsure and the answer
          is not explicitly written in the documentation, say
          "Sorry, I don't know how to help with that.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 750,
      temperature: 0.5,
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
            if (sources)
              controller.enqueue(
                encoder.encode(`+Sources+${JSON.stringify(sources)}`)
              );
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
