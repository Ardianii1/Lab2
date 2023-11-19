"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import toast from "react-hot-toast";

interface Categories {
   id: string;
   name: string;
   billboard: {
      label: string;
   };
   createdAt: Date;
}

type CategoryClientProps = {
   user: {
      name: string;
      role: string;
      email: string;
      id: string;
   };
};

const CategoryClient = ({ user }: CategoryClientProps) => {
   const [categoriesData, setCategoriesData] = useState<Categories[] | []>([]);
   const [formattedCategories, setFormattedCategories] = useState<
      CategoryColumn[]
   >([]);
   const userRole = user?.role;

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await axios.get(
               `http://localhost:3001/api/categories/${params.storeId}/all`
            );
            console.log(response);

            if (!response) {
               setCategoriesData([]);
               return null;
            }
            setCategoriesData(response.data);
         } catch (error) {
            console.error("Error fetching store:", error);
         }
      };

      fetchCategories();
   }, []);

   const params = useParams();

   useEffect(() => {
      const updateBillboardLabels = async () => {
         if (categoriesData.length > 0) {
            setFormattedCategories(
               categoriesData.map((item) => ({
                  id: item.id,
                  name: item.name,
                  billboard: item.billboard.label,
                  createdAt: item.createdAt,
               }))
            );
         }
      };
      updateBillboardLabels();
   }, [categoriesData]);

   return (
      <>
         <div className="flex items-center justify-between">
            <Heading
               title={`Categories (${categoriesData.length})`}
               description="Manage categories for your store"
            />

            {userRole === "ADMIN" || userRole === "MANAGER" ? (
               <Link
                  href={`http://localhost:3000/${params.storeId}/categories/new`}
               >
                  <Button asChild>
                     <div>
                        <Plus className="mr-2 h-4 w-4" />
                        Add new
                     </div>
                  </Button>
               </Link>
            ) : (
               <Button
                  className="cursor-pointer"
                  type="button"
                  asChild
                  onClick={() =>
                     toast.error(
                        "You dont have perrmision to add new Category"
                     )
                  }
               >
                  <div>
                     <Plus className="mr-2 h-4 w-4" />
                     Add new
                  </div>
               </Button>
            )}
         </div>
         <Separator />
         <DataTable
            columns={columns}
            data={formattedCategories}
            searchKey="name"
         />
      </>
   );
};

export default CategoryClient;
