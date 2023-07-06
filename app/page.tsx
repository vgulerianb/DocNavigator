"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Login() {
  const router = useRouter();

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
          <Link
            href={"https://github.com/vgulerianb/DocNavigator"}
            target="_blank"
            className="gh-button"
          >
            <span className="gh-button__icon"></span>Star
          </Link>
        </div>
      </div>
      <section className="bg-gray-50 dark:bg-gray-900 w-full h-full justify-center flex">
        <div className="max-w-[800px] flex flex-col gap-[16px] mt-[128px] text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            DocNavigator
          </h1>
          <div className="text-2xl text-white/80">
            AI-powered chatbot builder that is designed to improve the user
            experience on product documentation/support websites{" "}
          </div>
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit mx-auto"
          >
            Try it out for free
          </button>
          <video
            autoPlay
            loop
            muted
            className="rounded-md"
            src="https://storage.googleapis.com/mp3slaps-142012.appspot.com/DocNavigator.mp4"
          ></video>
        </div>
      </section>
    </div>
  );
}
