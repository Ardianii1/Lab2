"use client"
import { useEffect, useState } from "react";
import { SizeForm } from "./components/size-Form"
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const SizePage = async ({
    // params
}:{
    // params:{ sizeId: string}
}) => {
    const [sizeData, setSizeData] = useState({id:"",name:"",value:""})
    const {userId } = useAuth()

  

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeForm  />
        </div>
    </div>
  )
}

export default SizePage