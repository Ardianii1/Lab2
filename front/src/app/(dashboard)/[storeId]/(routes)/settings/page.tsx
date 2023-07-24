"use client"
import { auth, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/SettingForm";
import { useEffect, useState } from "react";

interface SettingsPageProps{
    params:{
        storeId:string;
    };
}

const SettingsPage:React.FC<SettingsPageProps> = async({
    params
}) =>{
    const [store, setStore] = useState();

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm  />
            </div>
        </div>
    )
}

export default SettingsPage