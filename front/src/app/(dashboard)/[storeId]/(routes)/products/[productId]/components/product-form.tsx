"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "./heading";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  stock: number;
  images: string[];
  createdAt: Date;
}

interface Category {
  name: string;
  id: string;
}

interface Size {
  name: string;
  id: string;
}
interface Brand {
  name: string;
  id: string;
}

const formSchema = z.object({
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  brandId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(1),
  status: z.string().min(1),
  stock: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  // initialData: product;
}
export const ProductForm: React.FC<ProductFormProps> = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productData, setproductData] = useState<
    | Product
    | {
        categoryId: string;
        sizeId: string;
        brandId: string;
        name: string;
        description: string;
        price: number;
        status: string;
        stock: number;
        images: [];
      }
  >({
    categoryId: "",
    sizeId: "",
    brandId: "",
    name: "",
    description: "",
    price: 0,
    status: "",
    stock: 0,
    images: [],
  });
  const [categoryData, setCategoryData] = useState<Category[] | []>([]);
  const [sizeData, setSizeData] = useState<Size[] | []>([]);
  const [brandData, setBrandData] = useState<Brand[] | []>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();

  const title = productData ? "Edit product" : "Create product";
  const description = productData ? "Edit a product" : "Add a new product";
  const toastMessage = productData ? "Product updated!" : "Product created!";
  const action = productData ? "Save changes" : "Create";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/${params.productId}`
        );
        console.log(response)
        const categoryResponse = await axios.get(
          `http://localhost:3001/api/categories/${params.storeId}/all`
        );
        console.log(categoryResponse)
        const sizeResponse = await axios.get(
          `http://localhost:3001/api/sizes/${params.storeId}/all`
        );
        console.log(sizeResponse)
        const brandResponse = await axios.get(
          `http://localhost:3001/api/brands/${params.storeId}/all`
        );
        console.log(brandResponse)
        // console.log(categoryResponse, sizeResponse, brandResponse);
        if (!response) {
          setproductData({
            categoryId: "",
            sizeId: "",
            brandId: "",
            name: "",
            description: "",
            price: 0,
            status: "",
            stock: 0,
            images: [],
          });
          return null;
        }
        setproductData(response.data);
        setCategoryData(categoryResponse.data);
        setSizeData(sizeResponse.data);
        setBrandData(brandResponse.data);
        productForm.reset(response.data, categoryResponse.data);
        router.refresh()
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchData();
  }, []);
  
  const defaultValuess = productData
    ? {
        ...productData,
        price: parseFloat(String(productData?.price)),
        stock: parseInt(String(productData?.stock)),
      }
    : {
        id: "",
        name: "",
        images: {},
        categoryId: "",
        description: "",
        sizeId: "",
        status: "",
        brandId: "",
        categoryd: "",
      };

  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValuess,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      console.log(data);
      if (productData) {
        await axios.patch(
          `http://localhost:3001/api/products/${params.storeId}/update/${params.productId}`,
          {
            ...data,
            userId: userId,
          }
        );
      } else {
        await axios.post(
          `http://localhost:3001/api/products/${params.storeId}/create`,
          {
            ...data,
            userId: userId,
          }
        );
      }
      router.refresh();
      router.push(`http://localhost:3000/${params.storeId}/products`);
      toast.success(toastMessage);
      console.log(data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      console.log("deleting...");
      axios.delete(
        `http://localhost:3001/api/products/${params.storeId}/delete/${params.productId}`,
        {
          data: {
            userId: userId,
          },
        }
      );
      console.log("DELETEDD");
      router.refresh();
      router.push(`http://localhost:3000/${params.storeId}/products`);
      toast.success("product Deleted successfuly");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {productData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...productForm}>
        <form
          onSubmit={productForm.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={productForm.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryData.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a brand"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brandData.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizeData.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage about="title" />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product status"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) =>
                        field.onChange([...field.value, { url }])
                      }
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
