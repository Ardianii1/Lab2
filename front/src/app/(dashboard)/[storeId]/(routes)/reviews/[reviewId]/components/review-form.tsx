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

interface review {
  id: string;
  title: string;
  content: string;
  rating : number;
  createdAt: Date;
}

const formSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  rating: z.number().min(1),
});

type ReviewFormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  // initialData: review;
}
export const ReviewForm: React.FC<ReviewFormProps> = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewData, setreviewData] = useState<review | {}>({});
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();

  const title = reviewData ? "Edit review" : "Create review";
  const description = reviewData ? "Edit a review" : "Add a new review";
  const toastMessage = reviewData ? "Review updated!" : "Review created!";
  const action = reviewData ? "Save changes" : "Create";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/reviews/${params.reviewId}`);
        // console.log(response)

        if (!response) {
          setreviewData({});
          return null;
        }
        // console.log(response.data)
        setreviewData(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: reviewData,
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      setLoading(true);
      console.log(data);

      if (reviewData) {
        await axios.patch(
          `http://localhost:3001/api/reviews/${params.storeId}/update/${params.reviewId}`,
          {
            ...data,
            userId: userId,
          }
        );
      } else {
        await axios.post(
          `http://localhost:3001/api/reviews/${params.storeId}/create`,
          {
            ...data,
            userId: userId,
          }
        );
      }
      router.refresh();
      router.push(`http://localhost:3000/${params.storeId}/reviews`);
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
        `http://localhost:3001/api/reviews/${params.storeId}/delete/${params.reviewId}`,
        {
          data: {
            userId: userId,
          },
        }
      );
      console.log("DELETEDD");
      router.refresh();
      router.push(`http://localhost:3000/${params.storeId}/reviews`);
      toast.success("review Deleted successfuly");
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
        {reviewData && (
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="review title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="review content"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
      control={form.control}
      name="rating"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rating</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={1}
              max={5}
              step={1}
              disabled={loading}
              placeholder="Enter rating from 1 to 5"
             // value={rating}
              //onChange={handleRatingChange}
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
      {/* <Separator/>
            <ApiAlert title="test" description="test" variant="public"/> */}
    </>
  );
};
