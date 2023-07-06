"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alertMessage, setAlertMessage] = useState<string>("");
  const timerRef = React.useRef<any>(null);

  useEffect(() => {
    if (alertMessage !== "") {
      timerRef.current = setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [alertMessage]);

  useEffect(() => {
    window["alert"] = (message: string) => {
      setAlertMessage(message);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>DocNavigator | Copilot for Docs</title>
        <meta
          name="description"
          content="AI-powered chatbot builder that is designed to improve the user experience on product documentation/support websites"
        />
      </head>
      <body className={inter.className + " dark h-screen"}>
        {alertMessage ? (
          <div
            className="absolute animate-pulse right-[50%] bottom-[10%] z-50 p-4 mb-4 translate-x-[50%] text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 max-w-[450px]"
            role="alert"
          >
            {alertMessage}
          </div>
        ) : (
          ""
        )}
        {children}
      </body>
    </html>
  );
}
