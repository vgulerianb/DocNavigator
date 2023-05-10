import { load } from "cheerio";
import axios from "axios";
import { encode } from "gpt-3-encoder";
import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";
const crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  password = process.env.APP_SECRET ?? "";
const jwtSecret = process.env.APP_SECRET ?? "";
const jwt = require("jsonwebtoken");

const CHUNK_SIZE = 200;
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export const getContent = async (url) => {
  let pageContent = {
    title: "",
    url: "",
    content: "",
    tokens: 0,
    chunks: [],
  };
  try {
    const html = await axios.get(url).catch((e) => {
      console.log("html", url, e);
    });
    const $ = load(html.data);
    pageContent.title = $("meta[property='og:title']").attr("content");
    pageContent.url = url;
    let content = "";
    $("h1, h2, h3, span,p").each((i, el) => {
      content += (el?.children?.[0]?.data ?? " ") + " ";
    });
    // let cleanedText = content
    //   .replace(/\s+/g, " ")
    //   .replace(/\.([a-zA-Z])/g, ". $1");
    pageContent.content = content;
    pageContent.tokens = encode(content).length;
  } catch (e) {
    console.log(e);
  }

  return pageContent;
};

export const getChunks = async (contentDetails) => {
  const { title, url, date, content } = contentDetails;

  let docContentChunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(".");
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence).length;
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength > CHUNK_SIZE) {
        docContentChunks.push(chunkText);
        chunkText = "";
      }
      //regex to check if last character is a letter or number, i means case insensitive
      if (
        sentence[sentence.length - 1] === " " ||
        /[a-zA-Z0-9]/.test(sentence)
      ) {
        chunkText += sentence + ". ";
      } else {
        chunkText += sentence + " ";
      }
    }
    docContentChunks.push(chunkText.trim());
  } else {
    docContentChunks.push(content.trim());
  }
  const dataChunks = docContentChunks.map((chunkText, i) => {
    const chunk = {
      content_title: title,
      content_url: url,
      content_date: date,
      content: chunkText,
      content_tokens: encode(chunkText).length,
      embedding: [],
    };
    return chunk;
  });
  if (dataChunks.length > 1) {
    for (let i = 0; i < dataChunks.length; i++) {
      const chunk = dataChunks[i];
      const prevChunk = dataChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_tokens = encode(prevChunk.content).length;
        dataChunks.splice(i, 1); //remove chunk from array
      }
    }
  }
  contentDetails.chunks = dataChunks;
  return contentDetails;
};

export const generateEmbeddings = async (data, meta) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const creationStatus = await supabaseClient
      .from("projects")
      .insert({
        project_name: meta?.projectName,
        project_id: data?.[0]?.id,
        created_by: meta?.userEmail,
      })
      .select("*");
    if (!creationStatus?.error)
      for (let i = 0; i < data.length; i++) {
        const currentData = data[i];
        for (let j = 0; j < currentData?.chunks?.length; j++) {
          const chunk = currentData.chunks[j];
          const embeddingResponse = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: chunk.content,
          });
          const [{ embedding }] = embeddingResponse.data.data;
          await supabaseClient
            .from("embeddings")
            .insert({
              content_title: chunk.content_title,
              content_url: chunk.content_url,
              content: chunk.content,
              content_tokens: chunk.content_tokens,
              embedding: embedding,
              project_id: currentData.id,
            })
            .select("*");

          await new Promise((resolve) => setTimeout(resolve, 1000));
          // promise works for it has error when you embedding stuff, might be read limited thing. it will wait 1 second and try again
        }
      }
  } catch (e) {
    console.log(e);
  }
  return;
};

export const decrypt = (text) => {
  let decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};

export const generateToken = (data) => {
  //JID - Unique id for jwt token
  data["jid"] =
    data["id"] +
    "_" +
    Math.round(Math.random() * 10000) +
    "_" +
    new Date().getTime();
  let token = jwt.sign(data, jwtSecret, { expiresIn: 30000 });
  return { token: token, jid: data["jid"] };
};

export const encrypt = (text) => {
  let cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};
