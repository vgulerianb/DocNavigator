import { createClient } from "@supabase/supabase-js";
import { encrypt, generateToken } from "../../utils";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  if (request?.email && request?.password && request?.name) {
    const { data: currentUser } = await supabaseClient
      .from("users")
      .select("*");
    if (currentUser?.length >= process.env.USER_SIGNUP_LIMIT)
      return res
        .status(400)
        .json({ success: false, message: "User signup limit reached" });
    for (let i = 0; i < currentUser.length; i++) {
      if (currentUser[i]?.email === request?.email)
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
    }
    const { data } = await supabaseClient.from("users").insert([
      {
        email: request.email,
        password: encrypt(request.password),
        name: request.name,
      },
    ]);
    res.status(200).json({
      success: true,
      token: generateToken({
        email: request.email,
        id: data?.[0]?.["id"],
      }),
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
};

export default handler;
