import { verifyToken } from "../../utils";
import { PrismaClient } from "@prisma/client";
import { haveProjectAccess } from "../../app/services/conversation.services";
import fs from "fs";
import path from "path";

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
  const project = await haveProjectAccess(
    prisma,
    request?.project_id,
    userEmail
  ).catch((err) => {
    console.log(err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  });
  console.log("project", project);
  await fs.writeFileSync(
    path.join(__dirname, "../../../../prisma/queuestatus"),
    "true"
  );
  await prisma.projects.update({
    where: {
      project_id: request?.project_id,
    },
    data: {
      status: "reprocessing",
    },
  });
  await prisma.taskqueue
    .createMany({
      data: request?.urls?.map((url) => ({
        url: url,
        project_id: request?.project_id,
      })),
      skipDuplicates: true,
    })
    .catch((error) => {
      console.log("error", error);
    });
  return res.status(200).json({ success: true });
};

export default handler;
