"use client"

import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"
import { format } from "date-fns"
import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from '@tanstack/react-table';
import { Category } from "@/app/types"

const SortableHeader = ({ column, title }: { column: any, title: string }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {title}
    <ArrowUpDown />
  </Button>
);

export const columns: ColumnDef<Category>[] = [
  {
    id: "index",  // Menambahkan kolom dengan ID "index"
    header: "#",  // Nama kolom untuk nomor urut
    cell: ({ row }) => row.index + 1,  // Mengambil index dan menambahkan 1 (untuk mulai dari 1, bukan 0)
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Date" />,
    cell: ({row}) => format(row.original.createdAt, 'dd MMM yyyy HH:mm')
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
