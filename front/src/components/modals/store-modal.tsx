"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { auth, useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.email;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // const { getToken } = useAuth();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
       setLoading(true);
       const requestBody = {
          userId: userId,
          ...values,
       };
       const response = await axios.post(
          `http://localhost:3001/api/stores/create`,
          requestBody
       );
       window.location.assign(`/${response.data.id}`);
       // toast.success("Store Created Sucessfuly!")
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

  return (
    <Modal
      title="Create Store"
      description="Add a new Store to manage your products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2  flex items-center justify-center">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={storeModal.onClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
