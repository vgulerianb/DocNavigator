"use client";

import Image from "next/image";

export default function Dashboard() {
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
        <NewProjectsModal />
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

const NewProjectsModal = () => {
  return (
    <div
      data-modal-backdrop="static"
      aria-hidden="true"
      className="fixed z-50 bg-gray-600/30 flex justify-center items-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Project
            </h3>
            <button
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
          <div className="p-6 space-y-6"></div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              data-modal-hide="staticModal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Create
            </button>
            <button
              data-modal-hide="staticModal"
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
