import {
  getChunks,
  getContent,
  generateEmbeddings,
  verifyToken,
} from "../../utils";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);
const { v4: uuidv6 } = require("uuid");

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  const chunkedData = [];
  let data = [];
  const project_id = uuidv6();
  const user = await verifyToken(req, res);
  if (!user.success)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  const userEmail = user?.email;
  if (req.method === "GET") {
    const { data: projectsData, error } = await supabaseClient
      .from("projects")
      .select("project_name, project_id")
      .eq("created_by", userEmail);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(200).json({ success: true, data: projectsData });
  } else {
    if (!request?.projectName?.trim() || !request?.urls?.length)
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    const toFetch = request.urls?.length > 1000 ? 1000 : request.urls?.length;
    for (let i = 0; i < toFetch; i++) {
      const content = await getContent(request.urls?.[i]);
      const chunkedContentData = await getChunks(content);
      chunkedData.push(chunkedContentData);
      data.push({ id: project_id, ...chunkedContentData });
    }
    await generateEmbeddings(data, {
      projectName: request?.projectName,
      userEmail,
    });
  }
  res.status(200).json({ success: true });
};

export default handler;
