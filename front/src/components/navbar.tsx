"use client";
import React, { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import { useSession } from "next-auth/react";

import StoreSwitcher from "./store-switcher";
import { Button } from "./ui/button";
interface Store {
   id: string;
   name: string;
}
interface NavBarProps{
   user:{
      name:string,
      email:string,
      role:string
   }
}

const Navbar = ({user}:NavBarProps) => {
   const { data: session } = useSession();

   return (
      <div className="border-b">
         <div className="flex h-16 items-center px-4">
            <StoreSwitcher
               //@ts-ignore
               session={session}
            />
            <MainNav className="mx-6" user={user}/>
            <div className="ml-auto flex items-center space-x-4">
               {/* <UserButton afterSignOutUrl="/" /> */}
               <p>Hello {user?.name}</p>
               <Button onClick={() => signOut()}>Sign Out</Button>
            </div>
         </div>
      </div>
   );
};

export default Navbar;
