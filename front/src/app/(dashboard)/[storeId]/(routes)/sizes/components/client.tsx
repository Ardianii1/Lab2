"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import toast from "react-hot-toast";

interface Size {
   id: string;
   name: string;
   value: string;
   createdAt: Date;
}
interface SizeClientProps {
   user: {
      name: string;
      role: string;
      email: string;
      id: string;
   };
}

const SizeClient = ({ user }: SizeClientProps) => {
   const [sizesData, setSizesData] = useState<Size[] | []>([]);
   const userRole = user?.role;

   useEffect(() => {
      const fetchSizes = async () => {
         try {
            const response = await axios.get(
               `http://localhost:3001/api/sizes/${params.storeId}/all`
            );
            console.log(response);

            if (!response) {
               setSizesData([]);
               return null;
            }
            setSizesData(response.data);
         } catch (error) {
            console.error("Error fetching store:", error);
         }
      };

      fetchSizes();
   }, []);
   const params = useParams();

   const formattedSizes: SizeColumn[] = sizesData.map((item) => ({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: item.createdAt, //format(item.createdAt, "dd MM yyyy")
   }));

   return (
      <>
         <div className="flex items-center justify-between">
            <Heading
               title={`Sizes (${sizesData.length})`}
               description="Manage sizes for your store"
            />
            {userRole === "ADMIN" || userRole === "MANAGER" ? (
               <Link href={`http://localhost:3000/${params.storeId}/sizes/new`}>
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
                     toast.error("You dont have perrmision to add new Size")
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
         <DataTable columns={columns} data={formattedSizes} searchKey="name" />
      </>
   );
};

export default SizeClient;
