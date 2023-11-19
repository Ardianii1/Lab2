"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginForm =  () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

  const onSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });
      if (!res?.error) {
        router.push(callbackUrl);
      }else {
        toast.error("Invalid email or password")
      }
    } catch (error:any) {
      console.log(error)
    }
    console.log("submit");
  };
  return (
     <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
           <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                 className="mx-auto h-10 w-auto"
                 src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                 alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                 Sign in to your account
              </h2>
           </div>

           <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
              <form className="space-y-6" onSubmit={onSubmit}>
                 <div>
                    <label
                       htmlFor="email"
                       className="block text-sm font-medium leading-6 text-white"
                    >
                       Email address
                    </label>
                    <div className="mt-2">
                       <input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          required
                          className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                       />
                    </div>
                 </div>

                 <div>
                    <div className="flex items-center justify-between">
                       <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-white"
                       >
                          Password
                       </label>
                       {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
                    </div>
                    <div className="mt-2">
                       <input
                          id="password"
                          name="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                          className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                       />
                    </div>
                 </div>
                 {error && <p className="text-red-500">{error}</p>}
                 <div className="pt-6">
                    <button
                       type="submit"
                       className=" flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                       Sign in
                    </button>
                 </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                 Not a member?{" "}
                 <a
                    href="/register"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                 >
                    Create account
                 </a>
              </p>
           </div>
        </div>
     </>
  );
};

export default LoginForm;
