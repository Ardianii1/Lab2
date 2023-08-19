"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams,} from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BrandColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";

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
        setbrandsData(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchbrands();
  }, []);

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
          title={`Brands (${brandsData.length})`}
          description="Manage brands for your store"
        />
        <Link href={`http://localhost:3000/${params.storeId}/brands/new`}>
          <Button asChild>
            <div>
              <Plus className="mr-2 h-4 w-4" />
              Add new
            </div>
          </Button>
        </Link>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedbrands} searchKey="name" />
    </>
  );
};

export default BrandClient;
