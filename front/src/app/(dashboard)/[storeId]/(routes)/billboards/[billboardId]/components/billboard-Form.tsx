"use client"

import { Button } from "@/components/ui/button";
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
import ImageUpload from "@/components/ui/image-upload";
import { Heading } from "@/components/ui/heading";

interface Billboard {
    label: string;
    imageUrl: string;
}

  
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})
    
type BillboardFormValues = z.infer<typeof formSchema>;
    
interface BillboardFormProps{
    // initialData: Billboard;
}
export const BillboardForm:React.FC<BillboardFormProps> = () =>{
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [billboardData, setBillboardData] = useState<Billboard | {}>({}); 
    const params = useParams()
    const router = useRouter()
    const {userId } = useAuth()

    const title = billboardData ? "Edit billboard" : "Create Billboard"
    const description = billboardData ? "Edit a billboard" : "Add a new Billboard"
    const toastMessage = billboardData ? "Billboard updated!" : "Billboard created!"
    const action = billboardData ? "Save changes" : "Create"


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/billboards/${params.billboardId}`);
        if (!response) {
            setBillboardData({})
            return null;
        }
        setBillboardData(response.data);
        form.reset(response.data)
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {} 
  });
    
    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true)
            console.log(data)

            if (billboardData) {
               await axios.patch(`http://localhost:3001/api/billboards/${params.storeId}/update/${params.billboardId}`, {
                    ...data,
                    userId: userId,
                  })
            }else{
                await axios.post(`http://localhost:3001/api/billboards/${params.storeId}/create`, {
                    ...data,
                    userId: userId,
                })
            }
            router.refresh()
            router.push(`http://localhost:3000/${params.storeId}/billboards`);
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
            axios.delete(`http://localhost:3001/api/billboards/${params.storeId}/delete/${params.billboardId}`, {
                data: {
                  userId: userId,
                }
            })
            console.log("DELETEDD")
            router.refresh()
            router.push(`http://localhost:3000/${params.storeId}/billboards`)
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
                {billboardData && (
                    <Button disabled={loading} variant="destructive" size="sm" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4"/>
                    </Button>   
                )} 
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField control={form.control} name="imageUrl" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value ? [field.value] : []}
                                    disabled={loading}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                            
                        )}/>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="label" 
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Billboard label" {...field} />
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
        </>
    )
} 