import { auth } from "@clerk/nextjs";
import axios from "axios";
import {redirect} from "next/navigation"
import Navbar from "@/components/navbar"

export default async function DashboardLayout({
    children,
    params
}:{
    children: React.ReactNode;
    params:{ storeId : string}
}) {
    const { userId } = auth()
    if (!userId) {
        redirect("/sign-in")
    }

    const store = await axios.get(`http://localhost:3001/api/stores/${params.storeId}`, {
      params: {
        userId: userId,
      },
    } )
    if (!store) {
        redirect('/');
      };
    
      return (
        <>
          <Navbar/>
          {children}
        </>
      );
}