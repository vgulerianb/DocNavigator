import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  let project_id = request?.project_id;
  const user = await verifyToken(req, res);
  const userEmail = user?.email;
  // add project auth
  if (!project_id)
    return res.status(400).json({ success: false, msg: "Invalid request" });
  const indexes = await prisma.embeddings.findMany({
    where: {
      project_id: project_id,
    },
  });
  if (project?.length === 0)
    return res.status(400).json({ success: false, msg: "Indexes not found" });
  res.status(200).json({ success: true, data: indexes });
};

export default handler;
