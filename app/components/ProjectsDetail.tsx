import axios from "axios";
import { SearchComponent } from "doc-navigator";
import { useState, useRef, useEffect } from "react";
import { PlaygroundHolder } from "./PlaygroundHolder";
import { ProjectProcessingState } from "./ProjectProcessingState";
import { IndexesComponent } from "./IndexesComponent";
import { ConversationsComponent } from "./ConversationsComponent";
import { useRouter } from "next/navigation";

const Menus = [
  "playground",
  "indexes",
  "conversations",
  "reports",
  "customize model",
];
export const ProjectsDetail = ({
  project_id,
  refresh,
}: {
  project_id: string;
  refresh: () => void;
}) => {
  const [menu, setMenu] = useState<string>("playground");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const interval = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (interval.current) clearInterval(interval.current);
    getProjectDetails();
    interval.current = setInterval(() => {
      getProjectDetails();
    }, 20000);
    () => {
      clearInterval(interval.current);
    };
  }, []);

  const getProjectDetails = async () => {
    const accessToken = localStorage.getItem("access_token");
    let isSuccessful = true;
    await axios
      .get("api/project?project_id=" + project_id, {
        headers: {
          Authorization: `${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data?.data?.[0]?.status !== "processing") {
          setLoading(false);
          clearInterval(interval.current);
        } else if (!res.data?.data?.[0]) {
          isSuccessful = false;
        }
      })
      .catch(() => {
        isSuccessful = false;
      });
    if (!isSuccessful) {
      clearInterval(interval.current);
      alert("Project not found");
    }
  };

  const deleteProject = async () => {
    const accessToken = localStorage.getItem("access_token");
    axios
      .put(
        "api/deleteProject",
        {
          project_id: project_id,
        },
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      )
      .then(() => {
        refresh();
        router.push("/dashboard");
      })
      .catch(() => {
        alert("Something went wrong");
      });
  };

  return (
    <>
      <div className="h-full flex ">
        <div className="w-[250px] bg-gray-800 h-full flex flex-col items-center pt-[24px] gap-[12px] p-[8px]">
          {Menus.map((val, idx) => (
            <div
              draggable
              key={idx}
              onClick={() => {
                setMenu(val);
              }}
              className={`border ${
                val === menu ? "border-blue-400" : "border-gray-600"
              } hover:bg-blue-900/10 flex flex-col rounded-md bg-gray-900 w-[240px] px-[8px] py-[12px] overflow-hidden cursor-pointer`}
            >
              <span className="font-bold text-[12px] text-white capitalize">
                {val}
              </span>
            </div>
          ))}
          <div
            onClick={() => {
              // confirm("Are you sure you want to delete this project?") &&
              confirm("Are you sure you want to delete this project?") &&
                deleteProject();
            }}
            className="text-red-600 cursor-pointer mt-auto py-[16px]"
          >
            Delete Project
          </div>
        </div>
        <div className="h-full w-full relative p-[32px]">
          {loading ? <ProjectProcessingState /> : ""}
          {menu === "playground" ? (
            <div className="flex items-center gap-[128px]">
              <PlaygroundHolder project_id={project_id} />
              <div>
                <h3 className="text-lg font-bold text-white">
                  Click on the component or press ⌘ + K to test it
                </h3>
                {isClient ? (
                  <SearchComponent
                    url={window?.location?.origin}
                    projectId={project_id}
                    variant="dark"
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : menu === "indexes" ? (
            <IndexesComponent project_id={project_id} />
          ) : menu === "conversations" ? (
            <ConversationsComponent project_id={project_id} />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-[28px] text-white">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </>
  );
};
