import { getChunks, getContent, generateEmbeddings } from "../../app/utils";

const { v4: uuidv6 } = require("uuid");

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  const chunkedData = [];
  const data = [];
  const project_id = uuidv6();
  const toFetch = request.urls?.length > 1000 ? 1000 : request.urls?.length;
  for (let i = 0; i < toFetch; i++) {
    const content = await getContent(request.urls?.[i]);
    const chunkedContentData = await getChunks(content);
    chunkedData.push(chunkedContentData);
    data.push({ id: project_id, ...chunkedContentData });
  }
  await generateEmbeddings(data);
  res.status(200).json({ success: true });
};

export default handler;
