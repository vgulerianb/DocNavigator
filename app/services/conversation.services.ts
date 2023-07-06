import { createClient } from "@supabase/supabase-js";
import { createParser } from "eventsource-parser";
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export const haveProjectAccess = async (
  prisma: {
    projects: {
      findFirst: (arg0: { where: { project_id: any; created_by: any } }) => any;
    };
  },
  project_id: any,
  email: any
) => {
  console.log("haveProjectAccess", project_id, email);
  const project = await prisma.projects.findFirst({
    where: {
      project_id: project_id,
      created_by: email,
    },
  });
  if (project) {
    return project;
  } else {
    throw new Error("Project not found");
  }
};

export const OpenAIstream = async (
  prompt: string,
  query: string,
  project_id: string,
  sessionId?: string,
  sources?: {
    url: string;
    title: string;
  }[]
) => {
  let streamData = "";
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
          content: `You are a human educator who loves to help people! Given the following sections from the given documentation, answer the question using only that information, outputted in markdown format (including related code snippets if available). If you are unsure and the answer is not explicitly written in the documentation try to answer it on our own and add this disclaimer: [DISCLAIMER].`,
        },
        {
          role: "user",
          content: `Question is "4+9"
Documentation section:
New Delhi is the capital of India and a part of the National Capital Territory of Delhi.`,
        },
        {
          role: "assistant",
          content: `[DISCLAIMER]
4 + 9 equals 13.`,
        },
        {
          role: "user",
          content: `Question is "What is meaning of life"
Documentation section:
New Delhi is the capital of India and a part of the National Capital Territory of Delhi.`,
        },
        {
          role: "assistant",
          content: `[DISCLAIMER]
The meaning of life is a philosophical and existential question that does not have a universally agreed-upon answer. It is a topic that people have different perspectives on and can vary depending on individual beliefs, values, and experiences.`,
        },
        {
          role: "user",
          content: `Question is "What is langchain"
              Documentation section:
                  CTRL K Welcome to LangChain Welcome to LangChain LangChain is a framework for developing applications powered by language models. We believe that the most powerful and differentiated applications will not only call out to a language model via an API, but will also: The LangChain framework is designed with the above principles in mind. Getting Started Checkout the guide below for a walkthrough of how to get started using LangChain to create a Language Model application. Components There are several main modules that LangChain provides support for. For each module we provide some examples to get started and get familiar with some of the concepts. Each example links to API documentation for the modules used. These modules are, in increasing order of complexity:               API Reference   Production As you move from prototyping into production, we\'re developing resources to help you do so.\nThese including: Additional Resources Additional collection of resources we think may be useful as you develop your application!\nCTRL K API Reference langchain/​chains Classes LLMChain<T, L> LLMChain<T, L Chain to run queries against LLMs.  Example       import   {  LLMChain  }   from   "langchain/chains" ;       import   {  OpenAI  }   from   "langchain/llms/openai" ;       import   {  PromptTemplate  }   from   "langchain/prompts" ;           const  prompt  =  PromptTemplate .
                  CTRL K API Reference langchain/​chains Classes ConversationChain ConversationChain Chain to run queries against LLMs.  Example       import   {  LLMChain  }   from   "langchain/chains" ;       import   {  OpenAI  }   from   "langchain/llms/openai" ;       import   {  PromptTemplate  }   from   "langchain/prompts" ;           const  prompt  =  PromptTemplate .  fromTemplate ( "Tell me a {adjective} joke" ) ;       const  llm  =   new   LLMChain ( {  llm :   new   OpenAI ( ) ,  prompt  } ) ;   Hierarchy LLMChain Constructors constructor()   Optional LLMChainInput string BaseLanguageModel ConversationChain «destructured» Optional LLMChainInput string BaseLanguageModel   ConversationChain     Properties lc_kwargs   SerializedFields     lc_serializable   boolean true     llm   BaseLanguageModel LLM Wrapper to use     outputKey   string "text" Key to use for output, defaults to  text     prompt   BasePromptTemplate Prompt object to use     verbose   boolean Whether to print out response text. \n    `,
        },
        {
          role: "assistant",
          content: `LangChain is a framework for developing applications powered by language models. It provides support for several main modules, including LLMChain and ConversationChain. The framework is designed to allow applications to call out to a language model via an API and also provides resources to help with moving from prototyping to production. To use LangChain, you can import the necessary modules and create instances of the desired chains: \`\`\`javascript import { LLMChain } from "langchain/chains"; import { OpenAI } from "langchain/llms/openai"; import { PromptTemplate } from "langchain/prompts"; const prompt = PromptTemplate.fromTemplate("Tell me a {adjective} joke"); const llm = new LLMChain({ llm: new OpenAI(), prompt }); \`\`\` This code snippet demonstrates how to create an instance of LLMChain using the OpenAI language model and a prompt template.`,
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
      const onParse: any = async (event: { type: string; data: any }) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            console.log("DONE", sessionId);
            await supabaseClient.from("conversations").insert({
              project_id: project_id,
              query: query,
              response: streamData,
              meta: JSON.stringify(sources),
              session_id: sessionId,
            });
            if (sources) {
              const uniQueSources = sources.filter(
                (v, i, a) => a.findIndex((t) => t.url === v.url) === i
              );
              controller.enqueue(
                encoder.encode(`+Sources+${JSON.stringify(uniQueSources)}`)
              );
            }
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            //choices is an array of objects. We want the first object in the array. delta is an object. content is a string
            streamData += text || "";
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
