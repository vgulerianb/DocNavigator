"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NewProjectsModal } from "../components/NewProjectsModal";
import { ProjectsDetail } from "../components/ProjectsDetail";
const handleLogout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/";
};

export default function Dashboard() {
  const [newProjectModal, setNewProjectModal] = useState(false);
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const query = useSearchParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/");
    } else {
      axios
        .get("/api/project", {
          headers: {
            Authorization: `${accessToken}`,
          },
        })
        .then((res) => {
          setProjects(res?.data?.data);
        })
        .catch(() => {
          handleLogout();
          alert("Session expired. Please login again.");
        });
    }
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="w-full bg-gray-800 flex justify-between p-[16px] fixed">
        <Image
          onClick={() => {
            router.push("/dashboard");
          }}
          className="cursor-pointer"
          src="/docnavigator.svg"
          width={140}
          height={28}
          alt={""}
        />
        <div className="flex gap-[16px]">
          <span
            onClick={handleLogout}
            className="bold pl-[8px] text-white cursor-pointer"
          >
            Sign out
          </span>
        </div>
      </div>
      <section className="bg-gray-900 h-full mt-[48px]">
        {newProjectModal ? (
          <NewProjectsModal
            onClose={() => {
              setNewProjectModal(false);
            }}
          />
        ) : (
          ""
        )}
        <div className={!query?.get("id") ? "p-[64px]" : "h-full"}>
          {projects?.length ? (
            <div className="flex items-center justify-between text-white">
              {!query?.get("id") ? (
                <>
                  <span className="flex justify-between items-center text-2xl">
                    Your Projects
                  </span>
                  <button
                    onClick={() => {
                      setNewProjectModal(true);
                    }}
                    className="bg-gray-900 rounded-md text-white text-[12px] w-fit font-bold  py-[8px] px-[16px]"
                  >
                    Create a new project
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            ""
          )}
          {!query?.get("id") ? (
            <div className="flex flex-wrap gap-[16px] mt-[32px]">
              {!projects?.length ? (
                <div className="h-full w-full grid items-center justify-center py-[15%]">
                  <div className="flex flex-col max-w-[350px] items-center bg-gray-800 p-[32px] rounded-md shadow-sm">
                    <span className="text-3xl text-center text-white">
                      {`You don't have any projects yet.`}
                    </span>
                    <button
                      onClick={() => {
                        setNewProjectModal(true);
                      }}
                      className="bg-gray-900 rounded-md text-white text-[12px] w-fit font-bold mt-[16px] py-[8px] px-[16px]"
                    >
                      Create a new project
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
              {projects?.map((val, key) => (
                <div
                  key={key}
                  draggable
                  onClick={() => {
                    router.push(`/dashboard?id=${val?.project_id}`);
                  }}
                  className="flex flex-col rounded-md bg-gray-800 w-[240px] p-[8px] overflow-hidden cursor-pointer border border-gray-600"
                >
                  <span className="font-bold text-[12px] text-white ">
                    {val?.project_name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <ProjectsDetail project_id={query?.get("id") ?? ""} />
          )}
        </div>
      </section>
    </div>
  );
}
