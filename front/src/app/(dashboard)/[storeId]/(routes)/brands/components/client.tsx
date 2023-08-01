"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "../../settings/components/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BrandColumn, columns } from "./columns";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";

interface brand {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
}

const BrandClient = () => {
  const [brandsData, setbrandsData] = useState<brand[] | []>([]);

  useEffect(() => {
    const fetchbrands = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/brands/${params.storeId}/all`
        );
        console.log(response);

        if (!response) {
          setbrandsData([]);
          return null;
        }
        // console.log(response.data)
        setbrandsData(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchbrands();
  }, []);

  const router = useRouter();
  const params = useParams();

  const formattedbrands: BrandColumn[] = brandsData.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.createdAt, //format(item.createdAt, "dd MM yyyy")
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`brands (${brandsData.length})`}
          description="Manage brands for your store"
        />
        <Button
          onClick={() =>
            router.push(`http://localhost:3000/${params.storeId}/brands/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedbrands} searchKey="name" />

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

export default BrandClient;
