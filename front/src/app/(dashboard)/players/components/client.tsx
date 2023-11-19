"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlayerColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";

interface player {
  id: string;
  name: string;
  number: string;
  team: string;
  createdAt: Date;
}

const PlayerClient = () => {
  const [playersData, setplayersData] = useState<player[] | []>([]);

  useEffect(() => {
   //  const fetchplayers = async () => {
   //    try {
   //      const response = await axios.get(
   //        `http://localhost:3001/api/players/all`
   //      );
   //      console.log(response);

   //      if (!response) {
   //        setplayersData([]);
   //        return null;
   //      }
   //      setplayersData(response.data);
   //    } catch (error) {
   //      console.error("Error fetching store:", error);
   //    }
   //  };

   //  fetchplayers();
  }, []);

  const params = useParams();
  //@ts-ignore
  const formattedplayers: PlayerColumn[] = playersData.map((item) => ({
    id: item.id,
    name: item.name,
    number: item.number,
    //@ts-ignore
    teamId: item.team?.name,
    createdAt: item.createdAt, //format(item.createdAt, "dd MM yyyy")
  }));
  // const formattedCoulmns: PlayerColumn = {

  // }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Players (${playersData.length})`}
          description="Manage players for your store"
        />
        <Link href={`http://localhost:3000/players/new`}>
          <Button asChild>
            <div>
              <Plus className="mr-2 h-4 w-4" />
              Add new
            </div>
          </Button>
        </Link>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedplayers} searchKey="number" />
    </>
  );
};

export default PlayerClient;
