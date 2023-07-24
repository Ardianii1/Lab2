"use client"
import React, { useEffect, useState } from 'react';
import { UserButton, auth } from '@clerk/nextjs';
import { MainNav} from "@/components/main-nav";
import StoreSwitcher from './store-switcher';
interface Store {
    id: string;
    name: string;
  }

const Navbar = () => {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher />
                <MainNav className="mx-6"/>
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
            
        </div>
    );
}

export default Navbar;