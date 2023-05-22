import { verifyToken } from "../../utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  const user = await verifyToken(req, res);
  if (!user.success)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  if (!request?.project_id) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
  const userEmail = user?.email;
  const conversations = await prisma.conversations
    .findMany({
      where: {
        project_id: request?.project_id ? request?.project_id : undefined,
      },
      select: {
        query: true,
        response: true,
        created_at: true,
      },
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    });
  console.log(conversations);
  return res.status(200).json({ success: true, data: conversations });
};

export default handler;
