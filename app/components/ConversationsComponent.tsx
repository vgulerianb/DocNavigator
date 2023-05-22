import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingSvg from "../SvgComps/loading";

export const ConversationsComponent = ({
  project_id,
}: {
  project_id: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [Conversations, setConversations] = useState<
    {
      meta: string;
      created_at: string;
      query: string;
      response: string;
    }[]
  >([]);
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    axios
      .get("api/conversations?project_id=" + project_id, {
        headers: {
          Authorization: `${accessToken}`,
        },
      })
      .then((res) => {
        setConversations(res.data?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <h1 className="font-bold text-white">Conversations</h1>
      <div className="flex flex-col gap-[16px] overflow-scroll h-full pb-[128px]">
        {loading ? (
          <div className="flex flex-col items-center gap-[8px] text-white mt-[64px]">
            <LoadingSvg />
            Please Wait...
          </div>
        ) : (
          Conversations.map((val, idx) => (
            <div
              className="w-full  flex flex-col gap-[16px] bg-gray-800 rounded-md p-[16px] text-white "
              key={idx}
            >
              <span className="text-white">Q. {val.query}</span>
              <span className="text-white">Ans. {val.response}</span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                Sources
              </span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {JSON.parse(val?.meta ?? "")?.map(
                  (source: any, idx: number) => (
                    <a
                      className="border p-[2px] rounded-sm max-w-[400px] whitespace-nowrap overflow-hidden text-ellipsis"
                      key={idx}
                      target="_blank"
                      href={source?.url}
                    >
                      {source?.url}
                    </a>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
