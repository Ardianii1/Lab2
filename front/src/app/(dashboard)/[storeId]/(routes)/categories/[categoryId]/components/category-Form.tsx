"use client"

import { Button } from "@/components/ui/button";
import { Heading } from "./heading";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface Category {
    name: string;
    id: string;
    billboardId: string
}
interface Billboard {
    label: string;
    id: string;
}

  
const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})
    
type CategoryFormValues = z.infer<typeof formSchema>;
    
interface CategoryFormProps{
    // initialData: Category;
}
export const CategoryForm:React.FC<CategoryFormProps> = () =>{
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState<Category | {}>({}); 
    const [billboardData, setBillboardData] = useState<Billboard[] | []>([]); 
    const params = useParams()
    const router = useRouter()
    const {userId } = useAuth()

    const title = categoryData ? "Edit category" : "Create category"
    const description = categoryData ? "Edit a category" : "Add a new category"
    const toastMessage = categoryData ? "category updated!" : "Category created!"
    const action = categoryData ? "Save changes" : "Create"


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(params.storeId)
          const response = await axios.get(`http://localhost:3001/api/categories/${params.categoryId}`);
          const billboardResponse = await axios.get(`http://localhost:3001/api/stores/${params.storeId}/billboards`);
          // console.log(response)

        if (!response) {
            setCategoryData({})
            return null;
        }
        if (!billboardResponse) {
            setBillboardData([])
            return null;
        }
            // console.log(response.data)
            setCategoryData(response.data);
            setBillboardData(billboardResponse.data);
            form.reset(response.data,billboardResponse.data)
            console.log(response.data,billboardResponse.data)
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  });
    
    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            console.log(data)

            if (categoryData) {
               await axios.patch(`http://localhost:3001/api/categories/${params.storeId}/update/${params.categoryId}`, {
                    ...data,
                    userId: userId,
                  })
            }else{
                await axios.post(`http://localhost:3001/api/categories/${params.storeId}/create`, {
                    ...data,
                    userId: userId,
                    // billboardId: billboardId,
                })
            }
            router.refresh()
            router.push(`http://localhost:3000/${params.storeId}/categories`);
            toast.success(toastMessage)
            console.log(data)
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async() => {
        try {
            setLoading(true)
            console.log("deleting...")
            axios.delete(`http://localhost:3001/api/categories/${params.storeId}/delete/${params.categoryId}`, {
                data: {
                  userId: userId,
                }
            })
            console.log("DELETEDD")
            router.refresh()
            router.push(`http://localhost:3000/${params.storeId}/categories`)
            toast.success("Billboard Deleted successfuly")

        } catch (error) {
            toast.error("Make sure you removed all products and categories first.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
        <AlertModal isOpen={open}  onClose={() => setOpen(false)}  onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {categoryData && (
                    <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4"/>
                    </Button>   
                )} 
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Category name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="billboardId" 
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                               <Select disabled={loading} onValueChange ={field.onChange} value={field.value} defaultValue={field.value} >
                                    <FormControl>
                                        <SelectTrigger >
                                            <SelectValue 
                                            defaultValue={field.value} placeholder="Select a billboard"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {billboardData.map((billboard) => (
                                            <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                               </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
            {/* <Separator/>
            <ApiAlert title="test" description="test" variant="public"/> */}
        </>
    )
} 