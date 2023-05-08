"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NewProjectsModal } from "../components/NewProjectsModal";

export default function Dashboard() {
  const [newProjectModal, setNewProjectModal] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="w-full bg-gray-800 flex justify-between p-[16px] fixed">
        <Image
          src="/next.svg"
          className="invert"
          width={120}
          height={28}
          alt={""}
        />
        <div className="flex gap-[16px]">
          <span>Settings</span>
          <span className="bold pl-[8px]">Sign out</span>
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
        <div className="p-[64px] ">
          <span>Your Projects</span>
          <div className="flex flex-wrap gap-[16px] mt-[32px]">
            {Array(7)
              .fill("")
              ?.map((val, key) => (
                <div
                  key={key}
                  draggable
                  className="flex flex-col rounded-md bg-gray-800 w-[240px] h-[128px] p-[8px] overflow-hidden cursor-pointer"
                >
                  <span className="font-bold text-[18px]">Project Name</span>
                  <span className="text-[12px]">
                    Project Description Project Description Project Description
                    Project Description Project Descript
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
