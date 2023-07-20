import { auth } from "@clerk/nextjs";
import {redirect} from "next/navigation"
import axios from "axios";
import { StoreModal } from "@/components/modals/store-modal";

export default async function SetupLayout({
    children
}:{
    children: React.ReactNode
}){
    const { userId } = auth()
    if (!userId) {
        redirect("/sign-in")
    }
    try {
        const store = await axios.get(`http://localhost:3001/api/stores/user/${userId}`)
        if (store) {
            redirect(`/${store.data.id}`)
        }
    } catch (error) {
        console.log(error)
    }
    // console.log(store)
    // if (!store) {
    //     return <StoreModal/>
    // }
    
    return (
        <>
          {children}
        </>
      );
}