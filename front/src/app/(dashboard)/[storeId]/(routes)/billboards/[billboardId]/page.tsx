"use client"
import { useEffect, useState } from "react";
import { BillboardForm } from "./components/billboard-Form"
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const BillboardPage = async ({
    // params
}:{
    // params:{ billboardId: string}
}) => {
    const [billboardData, setBillboardData] = useState({label:"",imageUrl:""})
    const {userId } = useAuth()

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await axios.get(`http://localhost:3001/api/billboards/${params.billboardId}`, {
    //             params: {
    //               userId: userId,
    //             }
    //         });
    //         if (!response) {
    //             return null
    //         }
    //             // console.log(response.data)
    //         setBillboardData(response.data);
    //         console.log(response.data)
    //       } catch (error) {
    //         console.error('Error fetching store:', error);
    //       }
    //     };
    
    //     fetchData();
    //   }, []);

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <BillboardForm  />
        </div>
    </div>
  )
}

export default BillboardPage