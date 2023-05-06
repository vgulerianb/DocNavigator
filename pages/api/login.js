import { createClient } from "@supabase/supabase-js";
import { decrypt, generateToken } from "../../utils";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const handler = async (req, res) => {
  const params = req.params;
  const queryParams = req.query;
  const bodyParams = req.body;
  const request = { ...params, ...queryParams, ...bodyParams };
  if (request?.email && request?.password) {
    const { data } = await supabaseClient
      .from("users")
      .select("*")
      .eq("email", request.email);
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
          id: data?.[0]?.["id"],
        }),
      });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid request" });
  }
};

export default handler;
