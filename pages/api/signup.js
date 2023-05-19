import { encrypt, generateToken } from "../../utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  if (request?.email && request?.password && request?.name) {
    const currentUsersCount = await prisma.users.count();
    if (currentUsersCount >= process.env.USER_SIGNUP_LIMIT)
      return res
        .status(400)
        .json({ success: false, message: "User signup limit reached" });
    const createUser = await prisma.users
      .create({
        data: {
          email: request.email,
          password: encrypt(request.password),
          name: request.name,
        },
      })
      .catch(async (err) => {
        if (err?.code === "P2021") {
          return res
            .status(400)
            .json({
              success: false,
              message: "Please initialize database by running yarn run initDb",
            });
        } else
          return res
            .status(400)
            .json({ success: false, message: "User already exists" });
      });
    if (createUser)
      res.status(200).json({
        success: true,
        token: generateToken({
          email: request.email,
        }),
      });
  } else {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
};

export default handler;
