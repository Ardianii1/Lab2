"use client"
import { Button } from "@/components/ui/button"
import { Heading } from "../../settings/components/heading"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { BillboardColumn, columns } from "./columns"
import { format } from "date-fns"
import { DataTable } from "@/components/ui/data-table"

interface Billboard {
  id:string
  label: string;
  imageUrl: string;
  createdAt: Date
}

const BillboardClient = () => {
  const [billboardsData, setBillboardsData] = useState<Billboard[] | []>([]); 


  useEffect(() => {
      const fetchBillboards = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/stores/${params.storeId}/billboards/`);
          console.log(response)
  
          if (!response) {
              setBillboardsData([])
              return null;
          }
              // console.log(response.data)
          setBillboardsData(response.data);
        } catch (error) {
          console.error('Error fetching store:', error);
        }
      };
  
      fetchBillboards();
    }, []);

    const router = useRouter()
    const params = useParams()


    const formattedBillboards: BillboardColumn[] = billboardsData.map((item)=>({
      id: item.id,
      label: item.label,
      createdAt: item.createdAt //format(item.createdAt, "dd MM yyyy")
    }))


  return (
    <>
        <div className="flex items-center justify-between">
            <Heading
                title={`Billboards (${billboardsData.length})`}
                description="Manage billboards for your store"
            />
            <Button onClick={() => router.push(`http://localhost:3000/${params.storeId}/billboards/new`)} >
                <Plus className="mr-2 h-4 w-4" />
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable columns={columns} data={formattedBillboards} searchKey="label" />
        
        
        
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

export default BillboardClient