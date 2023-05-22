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
      <div className="flex flex-col gap-[16px] overflow-scroll h-full">
        {loading ? (
          <div className="flex flex-col items-center gap-[8px] text-white mt-[64px]">
            <LoadingSvg />
            Please Wait...
          </div>
        ) : (
          Conversations.map((val, idx) => (
            <div
              className="w-full min-h-[64px] flex flex-col gap-[16px] bg-gray-800 rounded-md px-[16px] text-white"
              key={idx}
            >
              <span className="text-white">Q. {val.query}</span>
              <span className="text-white">Ans. {val.response}</span>
              <span className="text-white text-right">
                {new Date(val.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
};
