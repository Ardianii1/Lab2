"use client"
import { Button } from "@/components/ui/button"
import { Heading } from "../../settings/components/heading"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { SizeColumn, columns } from "./columns"
import { format } from "date-fns"
import { DataTable } from "@/components/ui/data-table"

interface Size {
  
  id: string;
  name:string;
  value: string;
  createdAt: Date
}

const SizeClient = () => {
  const [sizesData, setSizesData] = useState<Size[] | []>([]); 


  useEffect(() => {
      const fetchSizes = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/stores/${params.storeId}/sizes/`);
          console.log(response)
  
          if (!response) {
              setSizesData([])
              return null;
          }
              // console.log(response.data)
          setSizesData(response.data);
        } catch (error) {
          console.error('Error fetching store:', error);
        }
      };
  
      fetchSizes();
    }, []);

    const router = useRouter()
    const params = useParams()


    const formattedSizes: SizeColumn[] = sizesData.map((item)=>({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: item.createdAt //format(item.createdAt, "dd MM yyyy")
    }))


  return (
    <>
        <div className="flex items-center justify-between">
            <Heading
                title={`Sizes (${sizesData.length})`}
                description="Manage sizes for your store"
            />
            <Button onClick={() => router.push(`http://localhost:3000/${params.storeId}/sizes/new`)} >
                <Plus className="mr-2 h-4 w-4" />
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable columns={columns} data={formattedSizes} searchKey="label" />
        
        
        
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

export default SizeClient