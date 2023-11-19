"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { TagColumn, columns } from "./columns";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import toast from "react-hot-toast";

interface Tag {
   id: string;
   name: string;
   createdAt: Date;
}
interface TagClientProps {
   user: {
      email: string;
      id: string;
      name: string;
      role: string;
   };
}

const TagClient = ({user}:TagClientProps) => {
   const [tagsData, setTagsData] = useState<Tag[] | []>([]);
   const userRole = user?.role
   const router = useRouter();
   const params = useParams();

   useEffect(() => {
      const fetchTags = async () => {
         try {
            const response = await axios.get(
               `http://localhost:3001/api/tags/${params.storeId}/all`
            );
            console.log(response);

            if (!response) {
               setTagsData([]);
               return null;
            }
            setTagsData(response.data);
         } catch (error) {
            console.error("Error fetching store:", error);
         }
      };

      fetchTags();
   }, []);

   

   const formattedTags: TagColumn[] = tagsData.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.createdAt, //format(item.createdAt, "dd MM yyyy")
   }));

   return (
      <>
         <div className="flex items-center justify-between">
            <Heading
               title={`Tags (${tagsData.length})`}
               description="Manage tags for your store"
            />
            {userRole === "ADMIN" || userRole === "MANAGER" ? (
               <Link href={`http://localhost:3000/${params.storeId}/tags/new`}>
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
                        "You dont have perrmision to add new Tag"
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
         <DataTable columns={columns} data={formattedTags} searchKey="name" />
      </>
   );
};

export default TagClient;
