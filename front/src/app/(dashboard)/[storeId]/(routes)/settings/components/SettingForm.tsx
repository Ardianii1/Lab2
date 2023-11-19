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
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Store {
   id: string;
   name: string;
}

interface SettingsFormProps {
   user: {
      email: string | null | undefined;
      id: string | null | undefined;
      name: string | null | undefined;
      role: string | null | undefined;
   };
}

const formSchema = z.object({
   name: z.string().min(1),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ user }) => {
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [storeData, setStoreData] = useState({ name: "", id: "" }); // Store the store data in state
   const params = useParams();
   const router = useRouter();
   // const { data: session } = useSession();

   const userId = user?.email;
   const userRole = user?.role;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(
               `http://localhost:3001/api/stores/${params.storeId}`,
               {
                  params: {
                     userId: userId,
                  },
               }
            );
            // console.log(response.data)
            setStoreData(response.data);
            form.reset(response.data);
         } catch (error) {
            console.error("Error fetching store:", error);
         }
      };

      fetchData();
   }, []);

   const form = useForm<SettingFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {},
   });

   const onSubmit = async (data: SettingFormValues) => {
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
         return toast.error("You are not authorized to perform this action.");
      }
      try {
         setLoading(true);
         await axios.patch(
            `http://localhost:3001/api/stores/update/${params.storeId}`,
            {
               ...data,
               userId: userId,
            }
         );
         router.refresh();
         toast.success("Store updated successfuly");
         console.log(data);
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;

            if (axiosError.response) {
               const status = axiosError.response.status;
               const errorMessage = axiosError.response.data.error;

               if (status === 401) {
                  toast.error(errorMessage);
               } else if (status === 403) {
                  toast.error(errorMessage);
               } else if (status === 404) {
                  toast.error(errorMessage);
               } else {
                  toast.error(errorMessage);
               }
            } else {
               toast.error("Network error: Unable to connect to the server.");
            }
         } else {
            toast.error("An error occurred.");
         }
      } finally {
         setLoading(false);
      }
   };

   const onDelete = async () => {
      console.log(user.role);
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
         return toast.error("You are not authorized to perform this action.");
      }
      try {
         setLoading(true);
         await axios.delete(
            `http://localhost:3001/api/stores/delete/${params.storeId}`,
            {
               data: {
                  userId: userId,
               },
            }
         );
         router.refresh();
         router.push("/");
         toast.success("Store Deleted successfuly");
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;

            if (axiosError.response) {
               const status = axiosError.response.status;
               const errorMessage = axiosError.response.data.error;

               if (status === 401) {
                  toast.error(errorMessage);
               } else if (status === 403) {
                  toast.error(errorMessage);
               } else if (status === 404) {
                  toast.error(errorMessage);
               } else {
                  toast.error(errorMessage);
               }
            } else {
               toast.error("Network error: Unable to connect to the server.");
            }
         } else {
            toast.error("An error occurred.");
         }
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
            <Heading title="Settings" description="Manage store settings" />
            <Button
               disabled={loading}
               variant="destructive"
               size="sm"
               onClick={() => setOpen(true)}
               className={cn("disabled:cursor-not-allowed")}
            >
               <Trash className="h-4 w-4" />
            </Button>
         </div>
         <Separator />

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-8 w-full"
            >
               <div className="grid grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Store name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  Save changes
               </Button>
            </form>
         </Form>
      </>
   );
};
