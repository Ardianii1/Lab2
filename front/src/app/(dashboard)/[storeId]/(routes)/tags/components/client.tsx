"use client"
import { Button } from "@/components/ui/button"
import { Heading } from "../../settings/components/heading"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { TagColumn, columns } from "./columns"
import { format } from "date-fns"
import { DataTable } from "@/components/ui/data-table"

interface Tag {
  
  id: string;
  name:string;
  value: string;
  createdAt: Date
}

const TagClient = () => {
  const [tagsData, setTagsData] = useState<Tag[] | []>([]); 


  useEffect(() => {
      const fetchTags = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/tags/${params.storeId}/all`);
          console.log(response)
  
          if (!response) {
              setTagsData([])
              return null;
          }
              // console.log(response.data)
          setTagsData(response.data);
        } catch (error) {
          console.error('Error fetching store:', error);
        }
      };
  
      fetchTags();
    }, []);

    const router = useRouter()
    const params = useParams()


    const formattedTags: TagColumn[] = tagsData.map((item)=>({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: item.createdAt //format(item.createdAt, "dd MM yyyy")
    }))


  return (
    <>
        <div className="flex items-center justify-between">
            <Heading
                title={`Tags (${tagsData.length})`}
                description="Manage tags for your store"
            />
            <Button onClick={() => router.push(`http://localhost:3000/${params.storeId}/tags/new`)} >
                <Plus className="mr-2 h-4 w-4" />
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable columns={columns} data={formattedTags} searchKey="name" />
        
        
        
        {/* <div>
            { billboardsData.map((billboard) => (
                <div key={billboard.label}>
                    <p>label: {billboard.label}</p>
                    <p>id: {billboard.id}</p>
                </div>
            ))}
        </div> */}
    </>
  )
}

export default TagClient