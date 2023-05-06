import { load } from "cheerio";
import axios from "axios";
import { encode } from "gpt-3-encoder";
const CHUNK_SIZE = 200;

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  const chunkedData = [];
  const data = [];
  for (let i = 0; i < 2; i++) {
    console.log(i, request.urls?.[i]);
    const content = await getContent(request.urls?.[i]);
    const chunkedContentData = await getChunks(content);
    chunkedData.push(chunkedContentData);
    data.push({ ...content, chunks: chunkedContentData });
  }
  console.log({ chunkedData, data });
  res.status(200).json({ error: "loading" });
};

export default handler;

const getContent = async (url) => {
  let pageContent = {
    title: "",
    url: "",
    content: "",
    tokens: 0,
    chunks: [],
  };
  try {
    const html = await axios.get(url).catch((e) => {
      console.log(e);
    });
    const $ = load(html.data);
    pageContent.title = $("meta[property='og:title']").attr("content");
    pageContent.url = url;
    let content = "";
    $("h1, h2, h3, span,p").each((i, el) => {
      //   filter out html tags
      content += (el?.children?.[0]?.data ?? " ") + " ";
    });
    let cleanedText = content
      .replace(/\s+/g, " ")
      .replace(/\.([a-zA-Z])/g, ". $1");
    pageContent.content = cleanedText;
    pageContent.tokens = encode(cleanedText).length;
  } catch (e) {
    console.log(e);
  }

  return pageContent;
};

const getChunks = async (contentDetails) => {
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
  const chunkedContentData = {
    ...contentDetails,
    chunks: dataChunks,
  };
  return chunkedContentData;
};
