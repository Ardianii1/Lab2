"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/nextjs";
import { AlertModal } from "@/components/modals/alert-modal";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CellActionProps {
  data: TagColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.email;

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Tag Id copied to clipboard.");
  };

  const onDelete = async () => {
    try {
       setLoading(true);
       await axios.delete(
          `http://localhost:3001/api/tags/${params.storeId}/delete/${data.id}`,
          {
             data: {
                userId: userId,
             },
          }
       );
       router.push(`http://localhost:3000/${params.storeId}/tags`);
       router.refresh();
       toast.success("Tag Deleted successfuly");
    } catch (error:any) {
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
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy(data.id)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <Link
            href={`http://localhost:3000/${params.storeId}/tags/${data.id}`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
