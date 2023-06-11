import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingSvg from "../SvgComps/loading";
import { AddUrlModal } from "./AddUrlModal";

export const IndexesComponent = ({ project_id }: { project_id: string }) => {
  const [loading, setLoading] = useState(true);
  const [addUrlModal, setAddUrlModal] = useState(false);
  const [indexes, setIndexes] = useState<
    {
      url_id: string;
      content_url: string;
      content_title: string;
    }[]
  >([]);
  useEffect(() => {
    fetchIndexes();
  }, []);

  const fetchIndexes = () => {
    const accessToken = localStorage.getItem("access_token");
    axios
      .get("api/indexes?project_id=" + project_id, {
        headers: {
          Authorization: `${accessToken}`,
        },
      })
      .then((res) => {
        const filteredData = res.data?.data?.filter(
          (val: any, idx: number, arr: any[]) =>
            arr.findIndex((v: any) => v.content_url === val.content_url) === idx
        );
        console.log({ filteredData });
        setIndexes(filteredData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {addUrlModal ? (
        <AddUrlModal
          refreshIndexes={fetchIndexes}
          project_id={project_id}
          existingUrls={indexes?.map((val) => val.content_url)}
          onClose={() => {
            setAddUrlModal(false);
          }}
        />
      ) : (
        ""
      )}
      <div className="flex justify-between py-[4px]">
        <h1 className="font-bold text-white">
          Indexed Urls ({indexes?.length})
        </h1>
        <button
          onClick={() => {
            setAddUrlModal(true);
          }}
          className="bg-blue-500 rounded-md px-[8px] py-[4px] text-white"
        >
          Add Url <span className="text-white">+</span>
        </button>
      </div>
      <div className="flex flex-col gap-[16px] overflow-scroll h-[calc(100%-90px)]">
        {loading ? (
          <div className="flex flex-col items-center gap-[8px] text-white mt-[64px]">
            <LoadingSvg />
            Please Wait...
          </div>
        ) : (
          indexes.map((val, idx) => (
            <Link
              href={val.content_url}
              target="_blank"
              key={idx}
              className="w-full min-h-[64px] flex items-center gap-[16px] bg-gray-800 rounded-md px-[16px] text-white"
            >
              <span className="text-white">{val.content_title}</span> -
              <span className="text-white">{val.content_url}</span>
            </Link>
          ))
        )}{" "}
      </div>
    </>
  );
};
