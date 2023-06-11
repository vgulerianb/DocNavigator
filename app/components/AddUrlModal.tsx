import axios from "axios";
import { useEffect, useState } from "react";

export const AddUrlModal = ({
  onClose,
  project_id,
  existingUrls,
  refreshIndexes,
}: {
  onClose: () => void;
  project_id: string;
  existingUrls: string[];
  refreshIndexes: () => void;
}) => {
  const [mode, setMode] = useState<"sitemap" | "list" | "csv" | "nav">(
    "sitemap"
  );
  const [urls, setUrls] = useState<string[]>([]);
  const [allUrls, setAllUrls] = useState<string[]>([]);
  const [urlList, setUrlList] = useState<string>("");
  const [sitemapUrl, setSitemapUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [navUrl, setNavUrl] = useState<string>("");
  const [urlsFetching, setUrlsFetching] = useState<boolean>(false);

  const getUrls = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = reader.result as string;
      setAllUrls(text?.replaceAll(" ", "")?.split(","));
    };
    reader.readAsText(file);
  };

  //   get allUrls from sitemap
  const getSitemapUrls = () => {
    fetch(`/api/getUrls?url=${sitemapUrl}`)
      .then((res) => res.json())
      .then((data: { message: string; success: boolean; data: string[] }) => {
        if (!data?.success) alert(data?.message);
        const allUrls = data.data as string[];
        setAllUrls(allUrls ?? []);
      })
      .catch(() => {
        alert("Something went wrong");
      })
      .finally(() => {
        setUrlsFetching(false);
      });
  };

  const getNavUrls = () => {
    fetch(`/api/getUrls?url=${navUrl}&type=scrape`)
      .then((res) => res.json())
      .then((data: { message: string; success: boolean; data: string[] }) => {
        if (!data?.success) alert(data?.message);
        const allUrls = data.data as string[];
        setAllUrls(allUrls ?? []);
      })
      .catch(() => {
        alert("Something went wrong");
      })
      .finally(() => {
        setUrlsFetching(false);
      });
  };

  const addUrlsToProject = () => {
    setLoading(true);
    axios
      .post(
        "/api/addUrls",
        { project_id: project_id, urls: urls },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((res) => {
        if (res?.data?.success) {
          onClose();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        console.log({ err });
        alert("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
        refreshIndexes();
      });
  };

  useEffect(() => {
    const newUrls = allUrls.filter((url) => !existingUrls.includes(url));
    setUrls(newUrls);
  }, [allUrls]);

  return (
    <div
      onClick={() => onClose()}
      className="fixed z-50 bg-gray-600/30 flex justify-center items-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="relative bg-white rounded-lg shadow dark:bg-gray-700"
        >
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add URLs
            </h3>
            <button
              onClick={() => onClose()}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col p-6">
            <div className=" flex gap-[16px] items-center">
              <div
                onClick={() => {
                  setMode("sitemap");
                }}
                className={`${
                  mode === "sitemap" ? "border-blue-600 bg-blue-600/20" : ""
                } flex-1 h-fit rounded-md border border-gray-200 p-[16px] cursor-pointer hover:border-blue-600 hover:bg-blue-600/20`}
              >
                <span className="font-bold text-[12px] text-white">
                  Use Sitemap
                </span>
                <span className="text-[8px]"></span>
              </div>
              <div
                onClick={() => {
                  setMode("nav");
                }}
                className={`${
                  mode === "nav" ? "border-blue-600 bg-blue-600/20" : ""
                } flex-1 h-fit flex flex-col rounded-md border border-gray-200 p-[16px] cursor-pointer hover:border-blue-600 hover:bg-blue-600/20`}
              >
                <span className="font-bold text-[12px] text-white">
                  Use Navigation
                </span>
                <span className="text-[8px]  text-white">
                  For Docusaurus | Gitlab etc
                </span>
              </div>
              <div
                onClick={() => {
                  setMode("list");
                }}
                className={`${
                  mode === "list" ? "border-blue-600 bg-blue-600/20" : ""
                } flex-1 h-fit rounded-md border border-gray-200 p-[16px] cursor-pointer hover:border-blue-600 hover:bg-blue-600/20`}
              >
                <span className="font-bold text-[12px]  text-white">
                  List of websites
                </span>
                <span className="text-[8px] "></span>
              </div>
              <div
                onClick={() => {
                  setMode("csv");
                }}
                className={`${
                  mode === "csv" ? "border-blue-600 bg-blue-600/20" : ""
                } flex-1 h-fit rounded-md border border-gray-200 p-[16px] cursor-pointer hover:border-blue-600 hover:bg-blue-600/20`}
              >
                <span className="font-bold text-[12px]  text-white">
                  Upload CSV
                </span>
                <span className="text-[8px]"></span>
              </div>
            </div>{" "}
          </div>

          <div className="p-6">
            {mode === "sitemap" ? (
              <div className="flex">
                <input
                  type="text"
                  name="sitemap"
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  className="bg-gray-50 flex-1 h-[48px] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="https://example.com/sitemap.xml"
                />
                <button
                  disabled={urlsFetching}
                  onClick={() => {
                    setUrlsFetching(true);
                    getSitemapUrls();
                  }}
                  className="h-[48px] inline-flex justify-center items-center px-4 py-2 text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 "
                >
                  {urlsFetching ? "Please wait" : "Get URLs"}
                </button>
              </div>
            ) : mode === "nav" ? (
              <div className="flex">
                <input
                  type="text"
                  name="nav"
                  onChange={(e) => setNavUrl(e.target.value)}
                  className="bg-gray-50 flex-1 h-[48px] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="https://example.com/docs"
                />
                <button
                  disabled={urlsFetching}
                  onClick={() => {
                    setUrlsFetching(true);
                    getNavUrls();
                  }}
                  className="h-[48px] inline-flex justify-center items-center px-4 py-2 text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 "
                >
                  {urlsFetching ? "Please wait" : "Get URLs"}
                </button>
              </div>
            ) : mode === "csv" ? (
              <input
                onChange={(e: any) => {
                  getUrls(e?.target?.files?.[0]);
                }}
                type="file"
                name="csv"
                className="bg-gray-50 border h-[48px] border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            ) : (
              <input
                value={urlList}
                onChange={(e) => {
                  setUrlList(e.target.value?.replace(" ", ""));
                  setAllUrls(e.target.value?.split(","));
                }}
                type="text"
                name="list"
                className="bg-gray-50 h-[48px] border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="https://example.com/,https://example.com/about"
              />
            )}
            {urls?.length ? (
              <div className="text-green-500 pt-[16px] text-sm">
                {urls?.length} New URLs found
              </div>
            ) : (
              ""
            )}
            {allUrls?.length ? (
              <div className="text-red-500 pt-[16px] text-sm">
                {allUrls?.length - urls?.length} Duplicate URLs found
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              disabled={loading || !urls?.length}
              onClick={() => {
                addUrlsToProject();
              }}
              type="button"
              className={`text-white ${
                loading || !urls?.length
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-800"
              } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
