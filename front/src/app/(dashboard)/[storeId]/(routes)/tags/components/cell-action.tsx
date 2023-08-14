"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TagColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { AlertModal } from "@/components/modals/alert-modal"
import { tr } from "date-fns/locale"

interface CellActionProps{
    data: TagColumn
}


export const CellAction:React.FC<CellActionProps> = ({
    data
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const params = useParams()
    const {userId } = useAuth()

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Tag Id copied to clipboard.');
    }

    const onDelete = async() => {
        try {
            setLoading(true)
            // console.log("deleting...")
            axios.delete(`http://localhost:3001/api/tags/${params.storeId}/delete/${data.id}`, {
                data: {
                  userId: userId,
                }
            })
            // console.log("DELETEDD")
            router.push(`http://localhost:3000/${params.storeId}/tags`)
            router.refresh()
            toast.success("Tag Deleted successfuly")

        } catch (error) {
            toast.error("Make sure you removed all products and categories first.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

  return (
    <>
    <AlertModal isOpen={open} loading={loading} onClose={()=> setOpen(false)} onConfirm={onDelete} />
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onCopy(data.id)}>
                <Copy className="mr-2 h-4 w-4"/>
                Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`http://localhost:3000/${params.storeId}/tags/${data.id}`)} >
                <Edit className="mr-2 h-4 w-4"/>
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={()=> setOpen(true)}>
                <Trash className="mr-2 h-4 w-4"/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}
