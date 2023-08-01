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
import { ApiAlert } from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/image-upload";

interface Size {
    id: string;
    name:string;
    value: string;
    createdAt: Date
}

  
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
})
    
type SizeFormValues = z.infer<typeof formSchema>;
    
interface SizeFormProps{
    // initialData: Size;
}
export const SizeForm:React.FC<SizeFormProps> = () =>{
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sizeData, setSizeData] = useState<Size | {}>({}); 
    const params = useParams()
    const router = useRouter()
    const {userId } = useAuth()

    const title = sizeData ? "Edit size" : "Create size"
    const description = sizeData ? "Edit a size" : "Add a new size"
    const toastMessage = sizeData ? "size updated!" : "size created!"
    const action = sizeData ? "Save changes" : "Create"


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/sizes/${params.sizeId}`);
        // console.log(response)

        if (!response) {
            setSizeData({})
            return null;
        }
            // console.log(response.data)
        setSizeData(response.data);
        form.reset(response.data)
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {} 
  });
    
    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true)
            console.log(data)

            if (sizeData) {
               await axios.patch(`http://localhost:3001/api/sizes/${params.storeId}/update/${params.sizeId}`, {
                    ...data,
                    userId: userId,
                  })
            }else{
                await axios.post(`http://localhost:3001/api/sizes/${params.storeId}/create`, {
                    ...data,
                    userId: userId,
                })
            }
            router.refresh()
            router.push(`http://localhost:3000/${params.storeId}/sizes`);
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
            axios.delete(`http://localhost:3001/api/sizes/${params.storeId}/delete/${params.sizeId}`, {
                data: {
                  userId: userId,
                }
            })
            console.log("DELETEDD")
            router.refresh()
            router.push(`http://localhost:3000/${params.storeId}/sizes`)
            toast.success("Size Deleted successfuly")

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
                {sizeData && (
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
                                    <Input disabled={loading} placeholder="Size name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="value" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Size value" {...field} />
                                </FormControl>
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