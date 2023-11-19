"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Alert } from "@/components/ui/alert";

const RegisterForm = () => {
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [name, setName] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();
   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ email, password, name }),
            headers: {
               "Contnet-Type": "appication/json",
            },
         });
         if (res.ok) {
            signIn();
         } else {
            const responseBody = await res.json();
            if (res.status === 400 ) {
               toast.error(responseBody.error);
            } else {
               setError("Registration failed. Please try again."); // Generic error message
            }
         }
      } catch (error: any) {
         toast.error("Something went wrong try again", error);
         if (error) {
            
         }
         setError(error?.message);
      }
      console.log("submit");
   };
   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={() => {}}
            loading={loading}
         />
         <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
               <img
                  className="mx-auto h-10 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
               />
               <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                  Create an account
               </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
               <form className="space-y-6" onSubmit={onSubmit}>
                  <div>
                     <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-white"
                     >
                        Name
                     </label>
                     <div className="mt-2">
                        <input
                           id="name"
                           name="name"
                           type="text"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           autoComplete="name"
                           required
                           className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                     </div>
                  </div>
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
                  {error ? (
                     <p className="h-4">
                        <Alert>{error}</Alert>
                     </p>
                  ) : (
                     ""
                  )}
                  <div className="pt-6">
                     <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                     >
                        Sign up
                     </button>
                  </div>
               </form>

               <p className="mt-10 text-center text-sm text-gray-500">
                  Have account?{" "}
                  <a
                     href="/signin"
                     className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                     Sign in
                  </a>
               </p>
            </div>
         </div>
      </>
   );
};

export default RegisterForm;
