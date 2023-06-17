"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = () => {
    if (email && password) {
      setLoading(true);
      const loginRequest = fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());
      loginRequest
        .then((res) => {
          if (res?.token?.token) {
            localStorage.setItem("access_token", res?.token?.token);
            router.push("/dashboard");
          } else {
            alert("Invalid credentials");
          }
        })
        .catch(() => {
          alert("Invalid credentials");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 relative">
            <div className="absolute bg-gradient-conic w-[100px] h-[100px] top-[-200px]"></div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <button
                disabled={!(email && password && !loading)}
                type="submit"
                className={`w-full ${
                  email && password && !loading
                    ? "bg-slate-900"
                    : "bg-slate-400 cursor-not-allowed"
                } text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <div className="flex justify-center">
                <Link
                  className="py-[4px] text-blue-500 text-[12px] "
                  href={"/signup"}
                >
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full flex justify-center mt-[8px]">
          <a
            href="https://www.producthunt.com/posts/docnavigator?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-docnavigator"
            target="_blank"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=400035&theme=dark"
              alt="DocNavigator - Illuminating&#0032;paths&#0032;to&#0032;effortless&#0032;documentation&#0032;experiences | Product Hunt"
              style={{ width: "250px", height: "54px" }}
            />
          </a>
        </div>{" "}
      </div>
    </section>
  );
}
