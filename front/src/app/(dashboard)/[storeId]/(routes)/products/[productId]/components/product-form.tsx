"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
   Form,
   FormControl,
   FormDescription,
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
   Select as Selectt,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TagSelector } from "./tag-selector";
import Select from "react-select";
import { useSession } from "next-auth/react";

type Product = {
   id: string;
   categoryId: string;
   sizeId: string;
   brandId: string;
   name: string;
   description: string;
   price: number;
   status: string;
   stock: number;
   images: string[];
   attributes: string[];
   tags: string[];
   createdAt: Date;
};

type Category = {
   name: string;
   id: string;
};

type Size = {
   name: string;
   id: string;
};
type Tag = {
   id: string;
   name: string;
   storeId: string;
   productId: string | null;
   createdAt: string;
   updateAt: string;
};
type Brand = {
   name: string;
   id: string;
};
type Attribute = {
   name: string;
   value: string;
};

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
   attributes: z.object({ name: z.string(), value: z.string() }).array(),
   tags: z.array(z.string()).refine((value) => value.some((tag) => tag), {
      message: "You have to select at least one tag.",
   }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
   // initialData: product;
   user: {
      name: string;
      role: string;
      email: string;
      id: string;
   };
}
export const ProductForm: React.FC<ProductFormProps> = ({ user }) => {
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
           attributes: [];
           tags: [];
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
      attributes: [],
      tags: [],
   });
   const [categoryData, setCategoryData] = useState<Category[] | []>([]);
   const [sizeData, setSizeData] = useState<Size[] | []>([]);
   const [brandData, setBrandData] = useState<Brand[] | []>([]);
   const [attributes, setAttributes] = useState<Attribute[] | []>([
      { name: "", value: "" },
   ]);
   const [tagsData, setTagsData] = useState<Tag[] | []>([]);
   const [tagData, setTagData] = useState<Tag[] | []>([]);

   const params = useParams();
   const router = useRouter();

   const userId = user?.email;
   const userRole = user?.role;
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
            // console.log(response);
            const categoryResponse = await axios.get(
               `http://localhost:3001/api/categories/${params.storeId}/all`
            );
            // console.log(categoryResponse);
            const sizeResponse = await axios.get(
               `http://localhost:3001/api/sizes/${params.storeId}/all`
            );
            // console.log(sizeResponse);
            const brandResponse = await axios.get(
               `http://localhost:3001/api/brands/${params.storeId}/all`
            );
            const tagsResponse = await axios.get(
               `http://localhost:3001/api/tags/${params.storeId}/all`
            );
            // console.log(tagsResponse.data[0].name);
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
                  attributes: [],
                  tags: [],
               });
               return null;
            }
            setproductData(response.data);
            setCategoryData(categoryResponse.data);
            setSizeData(sizeResponse.data);
            setBrandData(brandResponse.data);
            setTagsData(tagsResponse.data);
            // setTagData(productData.tags);
            console.log(tagsData);
            productForm.reset(response.data, categoryResponse.data);
            router.refresh();
         } catch (error) {
            console.error("Error fetching store:", error);
         }
         if (productData) {
            setTagData(productData.tags as Tag[]);
         }
      };

      fetchData();
   }, []);
   // console.log(tagData)

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
           attributes: {},
           tags: [],
        };

   const productForm = useForm<ProductFormValues>({
      resolver: zodResolver(formSchema),
      // @ts-ignore
      defaultValues: defaultValuess,
   });

   const addAttribute = () => {
      setAttributes([...attributes, { name: "", value: "" }]);
   };
   const removeAttribute = (indexToRemove: number) => {
      const updatedAttributes = attributes.filter(
         (_, index) => index !== indexToRemove
      );
      setAttributes(updatedAttributes);
   };

   const onSubmit = async (data: ProductFormValues) => {
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
         return toast.error("You are not authorized to perform this action.");
      }
      try {
         setLoading(true);
         console.log("data", data);
         console.log("tags", data.tags);
         if (productData) {
            await axios.patch(
               `http://localhost:3001/api/products/${params.storeId}/update/${params.productId}`,
               {
                  ...data,
                  // tags:tags,
                  attributes: attributes,
                  userId: userId,
               }
            );
         } else {
            await axios.post(
               `http://localhost:3001/api/products/${params.storeId}/create`,
               {
                  ...data,
                  attributes: attributes,
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
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
         return toast.error("You are not authorized to perform this action.");
      }
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
         toast.error(
            "Make sure you removed all products and categories first."
         );
      } finally {
         setLoading(false);
         setOpen(false);
      }
   };
   // console.log(productData.tags)
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
                           <Selectt
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
                                    <SelectItem
                                       key={category.id}
                                       value={category.id}
                                    >
                                       {category.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Selectt>
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
                           <Selectt
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
                           </Selectt>
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
                           <Selectt
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
                           </Selectt>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="flex items-center justify-between">
                     <div className="flex flex-1 items-center space-x-2 text-black">
                        <Select
                           isMulti
                           name="tags"
                           options={tagsData.map((tag) => ({
                              value: tag.id,
                              label: tag.name,
                           }))}
                           className="basic-multi-select"
                           classNamePrefix="select"
                           //@ts-ignore
                           value={
                              tagsData &&
                              productForm
                                 .watch("tags")
                                 //@ts-ignore
                                 .map((tag) => ({value: tag?.id,label: tag?.name,}))
                           }
                           onChange={(selectedOptions) => {
                              const tags = selectedOptions
                                 ? selectedOptions.map((option) => option.value)
                                 : [];
                              productForm.setValue("tags", tags);
                           }}
                        />
                        {/* <TagSelector
                title="Select Tags"
                options={tagsData.map((tag) => ({ id: tag.id, name: tag.name, }))}
                selectedTags={ productForm.watch("tags") || tagData ||  []}
                onTagSelect={(tagValue) => {
                  const tags = productForm.getValues("tags") || [];
                  if (!tags.includes(tagValue)) {
                    tags.push(tagValue);
                    productForm.setValue("tags", tags);
                  }
                }}
                onTagDeselect={(tagValue) => {
                  const tags = productForm.getValues("tags") || [];
                  const updatedTags = tags.filter((tag) => tag !== tagValue);
                  productForm.setValue("tags", updatedTags);
                }}
              /> */}
                        <div className="space-x-2">
                           {productForm.watch("tags").map((selectedTagId) => {
                              const selectedTag = tagData.find(
                                 (tag) => tag.id === selectedTagId
                              );
                              return (
                                 <Badge
                                    key={selectedTag?.id}
                                    variant="secondary"
                                    className="rounded-sm px-2 py-1 font-normal"
                                 >
                                    {selectedTag?.name}
                                 </Badge>
                              );
                           })}
                        </div>
                     </div>
                  </div>
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
                                 authorized={
                                    userRole === "ADMIN" ||
                                    userRole === "MANAGER"
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
                  {attributes.map((attribute, index) => (
                     <div
                        key={index}
                        className="grid grid-cols-2 gap-4 relative"
                     >
                        <h3>Attribute{index + 1}</h3>
                        <Button
                           className="ml-44 p-1 bg-red-500 text-white rounded-full"
                           variant="destructive"
                           size="icon"
                           type="button"
                           onClick={() => removeAttribute(index)}
                        >
                           X
                        </Button>
                        <FormField
                           control={productForm.control}
                           name={attribute.name as keyof ProductFormValues}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Label</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Attribute label"
                                       value={attribute.name}
                                       onChange={(e) => {
                                          const updatedAttributes = [
                                             ...attributes,
                                          ];
                                          updatedAttributes[index].name =
                                             e.target.value;
                                          setAttributes(updatedAttributes);
                                       }}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={productForm.control}
                           name={attribute.value as keyof ProductFormValues}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Value</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Attribute value"
                                       value={attribute.value}
                                       onChange={(e) => {
                                          const updatedAttributes = [
                                             ...attributes,
                                          ];
                                          updatedAttributes[index].value =
                                             e.target.value;
                                          setAttributes(updatedAttributes);
                                       }}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  ))}
                  <Button
                     className="mx-auto my-auto"
                     size="sm"
                     type="button"
                     onClick={addAttribute}
                  >
                     Add Attribute
                  </Button>
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   );
};
