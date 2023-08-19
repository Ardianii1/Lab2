"use client"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ArrowUpDown} from "lucide-react"
import { Button } from "@/components/ui/button"

export type TagColumn = {
  id: string;
  name:string;
  value: string;
  createdAt: Date
}

export const columns: ColumnDef<TagColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "Actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
