"use client";

import { Button } from "@/components/ui/button";
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
import { Heading } from "@/components/ui/heading";

interface brand {
  id: string;
  name: string;
  createdAt: Date;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
  // initialData: brand;
}
export const BrandForm: React.FC<BrandFormProps> = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandData, setbrandData] = useState<brand | {}>({});
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();

  const title = brandData ? "Edit brand" : "Create brand";
  const description = brandData ? "Edit a brand" : "Add a new brand";
  const toastMessage = brandData ? "Brand updated!" : "Brand created!";
  const action = brandData ? "Save changes" : "Create";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/brands/${params.brandId}`);
        if (!response) {
          setbrandData({});
          return null;
        }
        setbrandData(response.data);
        form.reset(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: brandData,
  });

  const onSubmit = async (data: BrandFormValues) => {
    try {
      setLoading(true);
      console.log(data);

      if (brandData) {
        await axios.patch(
          `http://localhost:3001/api/brands/${params.storeId}/update/${params.brandId}`,
          {
            ...data,
            userId: userId,
          }
        );
      } else {
        await axios.post(
          `http://localhost:3001/api/brands/${params.storeId}/create`,
          {
            ...data,
            userId: userId,
          }
        );
      }
      router.refresh();
      router.push(`http://localhost:3000/${params.storeId}/brands`);
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
        `http://localhost:3001/api/brands/${params.storeId}/delete/${params.brandId}`,
        {
          data: {
            userId: userId,
          },
        }
      );
      console.log("DELETEDD");
      router.refresh();
      router.push(`http://localhost:3000/${params.storeId}/brands`);
      toast.success("brand Deleted successfuly");
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
        {brandData && (
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
                      placeholder="brand name"
                      {...field}
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
