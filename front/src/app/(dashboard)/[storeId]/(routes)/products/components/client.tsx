"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  size: string;
  status: string;
  stock: number;
  price: number;
  createdAt: Date;
};

const ProductClient = () => {
  const [productsData, setproductsData] = useState<Product[] | []>([]);
  const [formattedProducts, setFormattedProducts] = useState<ProductColumn[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const params = useParams();

  const fetchProducts = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(
        `http://localhost:3001/api/products/${params.storeId}/all?page=${currentPage}&pageSize=${pageSize}`
      );

      if (!response) {
        setproductsData([]);
        return;
      }

      setproductsData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    const updateCategoryLabels = async () => {
      if (productsData.length > 0) {
        setFormattedProducts(
          productsData.map((item) => ({
            id: item.id,
            name: item.name,
            status: item.status,
            description: item.description,
            price: item.price,
            categoryId: item.category.name,
            category: item.category.name,
            brand: item.brand.name,
            brandId: item.brand.name,
            createdAt: item.createdAt,
          }))
        );
      }
    };
    updateCategoryLabels();
  }, [productsData]);


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${productsData.length})`}
          description="Manage products for your store"
        />
        <Link href={`http://localhost:3000/${params.storeId}/products/new`}>
          <Button asChild>
            <div>
              <Plus className="mr-2 h-4 w-4" />
              Add new
            </div>
          </Button>
        </Link>
      </div>
      <Separator />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={formattedProducts} searchKey="name"/>
      )}
    </>
  );
};

export default ProductClient;
