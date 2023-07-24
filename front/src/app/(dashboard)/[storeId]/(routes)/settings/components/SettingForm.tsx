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

interface Store {
    id: string;
    name: string;
  }

interface SettingsFormProps{
    // initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1)
})

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingsForm:React.FC<SettingsFormProps> = () =>{
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [storeData, setStoreData] = useState({name:"",id :""}); // Store the store data in state
    const params = useParams()
    const router = useRouter()
    const {userId } = useAuth()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/stores/${params.storeId}`, {
            params: {
              userId: userId,
            },});
            // console.log(response.data)
        setStoreData(response.data); // Assuming the response data is an object representing the store
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: storeData?.name ?? "" } // Use storeData.name as the default value for the form field
  });
    
    const onSubmit = async (data: SettingFormValues) => {
        try {
            setLoading(true)
            axios.patch(`http://localhost:3001/api/stores/update/${params.storeId}`, {
                ...data,
                userId: userId,
              })
            router.refresh()
            toast.success("Store updated successfuly")
            console.log(data)
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage store settings"/>
                <Button disabled={loading} variant="destructive" size="sm" onClick={() => {}}>
                    <Trash className="h-4 w-4"/>
                </Button>    
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
                                    <Input disabled={loading} placeholder="Store name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save changes
                    </Button>
                </form>
            </Form>
        </>
    )
} 