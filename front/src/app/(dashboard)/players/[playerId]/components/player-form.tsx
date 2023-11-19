"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { number, z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface player {
  id: string;
  name: string;
  number: string;
  teamId: string;
}
interface Team {
  id: string;
  name: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  number: z.string().min(1),
  teamId: z.string().min(1),
});

type PlayerFormValues = z.infer<typeof formSchema>;

interface PlayerFormProps {
  // initialData: player;
}
export const PlayerForm: React.FC<PlayerFormProps> = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerData, setplayerData] = useState<player | {}>({});
  const [teams, setTeams] = useState<Team[]>([]);
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.email;

  const title = playerData ? "Edit player" : "Create player";
  const description = playerData ? "Edit a player" : "Add a new player";
  const toastMessage = playerData ? "Player updated!" : "Player created!";
  const action = playerData ? "Save changes" : "Create";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/players/${params.playerId}`
        );
        if (!response) {
          setplayerData({});
          return null;
        }
        const teamsResponse = await axios.get(
          `http://localhost:3001/api/teams/all`
        );
        setTeams(teamsResponse.data);
        setplayerData(response.data);
        form.reset(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: playerData,
  });

  const onSubmit = async (data: PlayerFormValues) => {
    try {
      setLoading(true);
      console.log(data);

      if (playerData) {
        await axios.patch(
          `http://localhost:3001/api/players/update/${params.playerId}`,
          {
            ...data,
          }
        );
      } else {
        await axios.post(`http://localhost:3001/api/players/create`, {
          ...data,
        });
      }
      router.refresh();
      router.push(`http://localhost:3000/players`);
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
        `http://localhost:3001/api/players/delete/${params.playerId}`,
        {
          data: {
            userId: userId,
          },
        }
      );
      console.log("DELETEDD");
      router.refresh();
      router.push(`http://localhost:3000/players`);
      toast.success("player Deleted successfuly");
    } catch (error) {
      //   toast.error("Make sure you removed all products and categories first.");
      console.log(error);
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
        {playerData && (
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
                      placeholder="player name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a team"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
