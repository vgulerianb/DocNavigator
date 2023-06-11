import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingSvg from "../SvgComps/loading";
import { ConversationModal } from "./ConversationModal";

export const ConversationsComponent = ({
  project_id,
}: {
  project_id: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedConversations, setSelectedConversations] = useState<
    {
      meta: string;
      created_at: string;
      query: string;
      response: string;
    }[]
  >([]);

  const [sessions, setSessions] = useState<
    {
      session: string;
      conversations: {
        meta: string;
        created_at: string;
        query: string;
        response: string;
      }[];
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
        setSessions(res.data?.data);
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
      {selectedConversations?.length ? (
        <ConversationModal
          conversations={selectedConversations}
          onClose={() => {
            setSelectedConversations([]);
          }}
        />
      ) : (
        ""
      )}
      <div className="flex flex-col gap-[16px] overflow-scroll h-full pb-[128px]">
        {loading ? (
          <div className="flex flex-col items-center gap-[8px] text-white mt-[64px]">
            <LoadingSvg />
            Please Wait...
          </div>
        ) : (
          sessions?.map((val, idx) => (
            <div
              onClick={() => {
                setSelectedConversations(val?.conversations);
              }}
              key={idx}
              className="w-full cursor-pointer flex flex-col gap-[16px] bg-gray-800 rounded-md p-[16px] text-white "
            >
              {val?.session}
              <span className="text-[14px] text-blue-600">
                {val?.conversations?.length * 2} messages
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
};
