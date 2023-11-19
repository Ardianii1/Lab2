"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";

interface review {
  id: string;
  title: string;
  content: string;
  rating: number;
  createdAt: Date;
}

const ReviewClient = () => {
  const [reviewsData, setreviewsData] = useState<review[] | []>([]);

//   useEffect(() => {
//     const fetchreviews = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/api/reviews/${params.storeId}/all`
//         );
//         console.log(response);

//         if (!response) {
//           setreviewsData([]);
//           return null;
//         }
//         // console.log(response.data)
//         setreviewsData(response.data);
//       } catch (error) {
//         console.error("Error fetching store:", error);
//       }
//     };

//     fetchreviews();
//   }, []);

  const params = useParams();

  const formattedreviews: ReviewColumn[] = reviewsData.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    rating: item.rating,
    createdAt: item.createdAt, //format(item.createdAt, "dd MM yyyy")
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Reviews (${reviewsData.length})`}
          description="Manage reviews for your store"
        />
        {/* <Link href={`http://localhost:3000/${params.storeId}/reviews/new`}>
          <Button asChild>
            <div>
              <Plus className="mr-2 h-4 w-4" />
              Add new
            </div>
          </Button>
        </Link> */}
      </div>
      <Separator />
      {/* <DataTable columns={columns} data={formattedreviews} searchKey="title" /> */}
      <h1 className="text-2xl text-center pt-4">Coming soon</h1>
    </>
  );
};

export default ReviewClient;
