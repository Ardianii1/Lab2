"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "../../settings/components/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { CategoryColumn, columns } from "./columns";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";

interface Categories {
  id: string;
  name: string;
  billboardId: string;
  createdAt: Date;
}

const CategoryClient = () => {
  const [categoriesData, setCategoriesData] = useState<Categories[] | []>([]);
  const [formattedCategories, setFormattedCategories] = useState<
    CategoryColumn[]
  >([]);

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
        // console.log(response.data)
        setCategoriesData(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchCategories();
  }, []);

  const router = useRouter();
  const params = useParams();

  const fetchBillboardLabel = async (billboardId: string): Promise<string> => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/stores/billboards/${billboardId}`
      );

      if (response && response.data && response.data.label) {
        return response.data.label;
      }
      return "N/A"; // Return a default label if billboard data not found
    } catch (error) {
      console.error("Error fetching billboard:", error);
      return "N/A";
    }
  };

  const fetchBillboardLabelsForCategories = async (): Promise<{
    [key: string]: string;
  }> => {
    const billboardLabels: { [key: string]: string } = {};
    for (const category of categoriesData) {
      const label = await fetchBillboardLabel(category.billboardId);
      billboardLabels[category.id] = label;
    }
    return billboardLabels;
  };

  useEffect(() => {
    const updateBillboardLabels = async () => {
      if (categoriesData.length > 0) {
        const billboardLabels = await fetchBillboardLabelsForCategories();
        setFormattedCategories(
          categoriesData.map((item) => ({
            id: item.id,
            name: item.name,
            billboardId: item.billboardId,
            createdAt: item.createdAt,
            billboardLabel: billboardLabels[item.id],
          }))
        );
      }
    };
    updateBillboardLabels();
  }, [categoriesData]);

  // const formattedCategories: CategoryColumn[] = categoriesData.map((item) => ({
  //   id: item.id,
  //   name: item.name,
  //   billboardId: item.billboardId,
  //   createdAt: item.createdAt,
  // }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categoriesData.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() =>
            router.push(
              `http://localhost:3000/${params.storeId}/categories/new`
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
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
