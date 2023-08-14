"use client"
import { useEffect, useState } from "react";
import { TagForm } from "./components/tag-Form"
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const TagPage = async () => {
    // const [tagData, setTagData] = useState()
    // const {userId } = useAuth()

  

  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <TagForm  />
        </div>
    </div>
  )
}

export default TagPage