"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "../../settings/components/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ReviewColumn, columns } from "./columns";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";

interface review {
  id: string;
  title: string;
  content: string;
  rating: number;
  createdAt: Date;
}

const ReviewClient = () => {
  const [reviewsData, setreviewsData] = useState<review[] | []>([]);

  useEffect(() => {
    const fetchreviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/reviews/${params.storeId}/all`
        );
        console.log(response);

        if (!response) {
          setreviewsData([]);
          return null;
        }
        // console.log(response.data)
        setreviewsData(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchreviews();
  }, []);

  const router = useRouter();
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
          title={`reviews (${reviewsData.length})`}
          description="Manage reviews for your store"
        />
        <Button
          onClick={() =>
            router.push(`http://localhost:3000/${params.storeId}/reviews/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedreviews} searchKey="name" />

      {/* <div>
            { billboardsData.map((billboard) => (
                <div key={billboard.label}>
                    <p>label: {billboard.label}</p>
                    <p>id: {billboard.id}</p>
                </div>
            ))}
        </div> */}
    </>
  );
};

export default ReviewClient;
