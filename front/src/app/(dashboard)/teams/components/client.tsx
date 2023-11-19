"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { TeamColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";

interface team {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
}

const TeamClient = () => {
  const [teamsData, setteamsData] = useState<team[] | []>([]);

  useEffect(() => {
   //  const fetchteams = async () => {
   //    try {
   //      const response = await axios.get(
   //        `z/api/teams/all`
   //      );
   //      console.log(response);

   //      if (!response) {
   //        setteamsData([]);
   //        return null;
   //      }
   //      setteamsData(response.data);
   //    } catch (error) {
   //      console.error("Error fetching store:", error);
   //    }
   //  };

   //  fetchteams();
  }, []);

  const params = useParams();
  //@ts-ignore
  const formattedteams: TeamColumn[] = teamsData.map((item) => ({
    id: item.id,
    name: item.name,
    // createdAt: item.createdAt, //format(item.createdAt, "dd MM yyyy")
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Teams (${teamsData.length})`}
          description="Manage teams for your store"
        />
        <Link href={`http://localhost:3000/teams/new`}>
          <Button asChild>
            <div>
              <Plus className="mr-2 h-4 w-4" />
              Add new
            </div>
          </Button>
        </Link>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedteams} searchKey="name" />
    </>
  );
};

export default TeamClient;
