"use client"
import {useAuth } from "@clerk/nextjs";
import {redirect, useRouter} from "next/navigation"
import axios from "axios";
import { StoreModal } from "@/components/modals/store-modal";
import { toast } from "react-hot-toast";
import Error from "next/error";
import { useEffect } from "react";

export default async function SetupLayout({
    children
}:{
    children: React.ReactNode
}){
    const { userId } = useAuth()
    const router = useRouter()
    if (!userId) {
        redirect("/sign-in")
    }
    useEffect(()=>{
        async function fetchStore() {
        try {
            const store = await axios.get(`http://localhost:3001/api/stores/user/${userId}`)
            if (store) {
                router.push(`http://localhost:3000/${store.data.id}`)
            }
        } catch (error) {
            console.log(error)
        }
    }
    fetchStore()
    },[])
    // console.log(store)
    // if (!store) {
    //     return <StoreModal/>
    // }
    
    return (
        <>
          <div>
            {children}
          </div>
        </>
      );
}