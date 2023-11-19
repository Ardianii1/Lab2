import prismadb from "@/lib/prismadb";
import axios from "axios";
import { redirect } from "next/navigation";

export const getStoreUser= async(userId:string)=> {
      try {
        const store = await axios.get(
          `http://localhost:3001/api/stores/user/${userId}`
        );
        console.log(store)
        if (store) {
          // onClose();
          redirect(`/${store.data.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }