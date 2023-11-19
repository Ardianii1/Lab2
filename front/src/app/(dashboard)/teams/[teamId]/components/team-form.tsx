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

interface team {
  id: string;
  name: string;
  createdAt: Date;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type TeamFormValues = z.infer<typeof formSchema>;

interface TeamFormProps {
  // initialData: team;
}
export const TeamForm: React.FC<TeamFormProps> = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamData, setteamData] = useState<team | {}>({});
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.email;

  const title = teamData ? "Edit team" : "Create team";
  const description = teamData ? "Edit a team" : "Add a new team";
  const toastMessage = teamData ? "Team updated!" : "Team created!";
  const action = teamData ? "Save changes" : "Create";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/teams/${params.teamId}`
        );
        if (!response) {
          setteamData({});
          return null;
        }
        setteamData(response.data);
        form.reset(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: teamData,
  });

  const onSubmit = async (data: TeamFormValues) => {
    try {
      setLoading(true);
      console.log(data);

      if (teamData) {
        await axios.patch(
          `http://localhost:3001/api/teams/update/${params.teamId}`,
          {
            ...data,
            userId: userId,
          }
        );
      } else {
        await axios.post(`http://localhost:3001/api/teams/create`, {
          ...data,
          userId: userId,
        });
      }
      router.refresh();
      router.push(`http://localhost:3000/teams`);
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
      axios.delete(`http://localhost:3001/api/teams/delete/${params.teamId}`, {
        data: {
          userId: userId,
        },
      });
      console.log("DELETEDD");
      router.refresh();
      router.push(`http://localhost:3000/teams`);
      toast.success("team Deleted successfuly");
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
        {teamData && (
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
                      placeholder="team name"
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
