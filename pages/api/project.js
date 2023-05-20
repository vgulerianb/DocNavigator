import { verifyToken } from "../../utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    const projects = await prisma.projects
      .findMany({
        where: {
          created_by: userEmail,
        },
        select: {
          project_name: true,
          project_id: true,
        },
      })
      .catch((error) => {
        return res.status(400).json({ success: false, message: error.message });
      });
    return res.status(200).json({ success: true, data: projects });
  } else {
    if (!request?.projectName?.trim() || !request?.urls?.length)
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    const creationStatus = await prisma.projects.create({
      data: {
        project_name: request?.projectName?.trim(),
        project_id: project_id,
        created_by: userEmail,
        status: "processing",
      },
    });
    if (creationStatus?.id) {
      await prisma.taskqueue
        .createMany({
          data: request?.urls?.map((url) => ({
            url: url,
            project_id: project_id,
          })),
          skipDuplicates: true,
        })
        .catch((error) => {
          console.log("error", error);
        });
      return res.status(200).json({ success: true });
    } else
      return res
        .status(400)
        .json({ success: false, message: "Error creating project" });
  }
};

export default handler;
