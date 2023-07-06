import { createClient } from "@supabase/supabase-js";
import allowCors from "../../utils/allowCors";
import { OpenAIstream } from "@/app/services/conversation.services";

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
    const { query, sources, projectId, sessionId } = (await req.json()) as {
      query: string;
      sources?: boolean;
      projectId?: string;
      sessionId?: string;
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
    console.log({ chunks });
    if (error) {
      console.log({ error, chunks });
      return allowCors(req, new Response("Error", { status: 500 }));
    }
    const prompt = `
    Question is "${query}"
    Documentation section:
    ${chunks.map((chunk: { content: string }) => chunk.content).join("\n")}
    `;
    const stream = chunks?.length
      ? await OpenAIstream(
          prompt,
          query,
          projectId,
          sessionId,
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
