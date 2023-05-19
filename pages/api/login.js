import { decrypt, generateToken, initDb } from "../../utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  if (request?.email && request?.password) {
    const data = await prisma.users.findMany({
      where: {
        email: request.email,
      },
      select: {
        password: true,
        id: true,
      },
    });
    if (
      !(
        data?.length && request["password"] === decrypt(data?.[0]?.["password"])
      )
    )
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    else {
      res.status(200).json({
        success: true,
        token: generateToken({
          email: request.email,
        }),
      });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
};

export default handler;
