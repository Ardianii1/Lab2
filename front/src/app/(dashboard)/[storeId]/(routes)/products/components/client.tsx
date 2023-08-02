"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "../../settings/components/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductColumn, columns } from "./columns";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";

interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  sizeId: string;
  status: string;
  stock: number;
  price: number;
  createdAt: Date;
}

const ProductClient = () => {
  const [productsData, setproductsData] = useState<Product[] | []>([]);
  const [formattedProducts, setFormattedProducts] = useState<ProductColumn[]>(
    []
  );

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/${params.storeId}/all`
        );
        console.log(response);

        if (!response) {
          setproductsData([]);
          return null;
        }
        // console.log(response.data)
        setproductsData(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchproducts();
  }, []);

  const router = useRouter();
  const params = useParams();

  const fetchCategoryLabel = async (categoryId: string): Promise<string> => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/categories/${categoryId}`
      );

      if (response && response.data && response.data.name) {
        return response.data.name;
      }
      return "N/A"; // Return a default label if category data not found
    } catch (error) {
      console.error("Error fetching category:", error);
      return "N/A";
    }
  };

  const fetchCategoryLabelsForCategories = async (): Promise<{
    [key: string]: string;
  }> => {
    const categoryLabels: { [key: string]: string } = {};
    for (const category of productsData) {
      const label = await fetchCategoryLabel(category.categoryId);
      categoryLabels[category.id] = label;
    }
    return categoryLabels;
  };

  useEffect(() => {
    const updateCategoryLabels = async () => {
      if (productsData.length > 0) {
        const categoryLabels = await fetchCategoryLabelsForCategories();
        const brandLabels = await fetchBrandLabelsForCategories();

        setFormattedProducts(
          productsData.map((item) => ({
            id: item.id,
            name: item.name,
            // createdAt: item.createdAt,
            status: item.status,
            price:item.price,
            categoryId: item.categoryId,
            category: categoryLabels[item.id],
            brand: brandLabels[item.id],
          }))
        );
      }
    };
    updateCategoryLabels();
  }, [productsData]);
  
  const fetchBrandLabel = async (brandId: string): Promise<string> => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/brands/${brandId}`
      );

      if (response && response.data && response.data.name) {
        return response.data.name;
      }
      return "N/A"; // Return a default label if brand data not found
    } catch (error) {
      console.error("Error fetching brand:", error);
      return "N/A";
    }
  };

  const fetchBrandLabelsForCategories = async (): Promise<{
    [key: string]: string;
  }> => {
    const brandLabels: { [key: string]: string } = {};
    for (const brand of productsData) {
      const label = await fetchBrandLabel(brand.brandId);
      brandLabels[brand.id] = label;
    }
    return brandLabels;
  };

  // useEffect(() => {
  //   const updateBrandLabels = async () => {
  //     if (productsData.length > 0) {
  //       const brandLabels = await fetchBrandLabelsForCategories();
  //       setFormattedProducts(
  //         productsData.map((item) => ({
  //           id: item.id,
  //           name: item.name,
  //           brandId: item.brandId,
  //           createdAt: item.createdAt,
  //           brand: brandLabels[item.id],
  //           status:item.status
  //           // categoryId: item.categoryId,
  //           // category: brandLabels[item.id],
  //         }))
  //       );
  //     }
  //   };
  //   updateBrandLabels();
  // }, [productsData]);

  // const formattedproducts: ProductColumn[] = productsData.map((item) => ({
  //   id: item.id,
  //   name: item.name,
  //   desctiption: item.description,
  //   price:item.price,
  //   status: item.status,
  //   createdAt: item.createdAt, //format(item.createdAt, "dd MM yyyy")
  // }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${productsData.length})`}
          description="Manage products for your store"
        />
        <Button
          onClick={() =>
            router.push(`http://localhost:3000/${params.storeId}/products/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedProducts} searchKey="name" />
    </>
  );
};

export default ProductClient;
