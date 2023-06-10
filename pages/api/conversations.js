import { verifyToken } from "../../utils";
import { PrismaClient } from "@prisma/client";
import { haveProjectAccess } from "../../app/services/conversation.services";

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
  await haveProjectAccess(prisma, request?.project_id, userEmail).catch(
    (err) => {
      console.log(err);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  );
  const conversations = await prisma.conversations
    .findMany({
      where: {
        project_id: request?.project_id ? request?.project_id : undefined,
      },
      select: {
        query: true,
        response: true,
        created_at: true,
        meta: true,
        session_id: true,
      },
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    });

  const sessions = {};
  conversations.forEach((conversation) => {
    const { session_id, ...rest } = conversation;
    if (session_id in sessions) {
      sessions[session_id].conversations.push(rest);
    } else {
      sessions[session_id] = {
        session: session_id,
        conversations: [rest],
      };
    }
  });

  return res.status(200).json({ success: true, data: Object.values(sessions) });
};

export default handler;
