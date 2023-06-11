export const ConversationModal = ({
  onClose,
  conversations,
}: {
  onClose: () => void;
  conversations: {
    meta: string;
    created_at: string;
    query: string;
    response: string;
  }[];
}) => {
  return (
    <div
      onClick={() => onClose()}
      className="fixed z-50 bg-gray-600/30 flex justify-center items-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full max-w-[90%] max-h-full">
        {conversations.map((val, idx) => (
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
              {safeParse(val?.meta ?? "")?.map((source: any, idx: number) => (
                <a
                  className="border p-[2px] rounded-sm max-w-[400px] whitespace-nowrap overflow-hidden text-ellipsis"
                  key={idx}
                  target="_blank"
                  href={source?.url}
                >
                  {source?.url}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const safeParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
};
