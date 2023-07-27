"use client"
import { Button } from "@/components/ui/button"
import { Heading } from "../../settings/components/heading"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { CategoryColumn, columns } from "./columns"
import { format } from "date-fns"
import { DataTable } from "@/components/ui/data-table"

interface Categories {
  id:string
  label: string;
  billboardLabel: string
  createdAt: Date
}

const CategoryClient = () => { 
  const [categoriesData, setCategoriesData] = useState<Categories[] | []>([]); 


  useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/categories/${params.storeId}/all`);
          console.log(response)
  
          if (!response) {
              setCategoriesData([])
              return null;
          }
              // console.log(response.data)
          setCategoriesData(response.data);
        } catch (error) {
          console.error('Error fetching store:', error);
        }
      };
  
      fetchCategories();
    }, []);


    const router = useRouter()
    const params = useParams()


    const formattedCategories: CategoryColumn[] = categoriesData.map((item) => ({
      id: item.id,
      name: item.label,
      createdAt: item.createdAt,
    }));
    


  return (
    <>
        <div className="flex items-center justify-between">
            <Heading
                title={`Billboards (${categoriesData.length})`}
                description="Manage billboards for your store"
            />
            <Button onClick={() => router.push(`http://localhost:3000/${params.storeId}/categories/new`)} >
                <Plus className="mr-2 h-4 w-4" />
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable columns={columns} data={formattedCategories} searchKey="label" />
    </>
  )
}

export default CategoryClient