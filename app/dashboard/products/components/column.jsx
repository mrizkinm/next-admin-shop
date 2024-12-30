"use client"

import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"
import { format } from "date-fns"
import { ArrowUpDown, Check, X } from "lucide-react"

const SortableHeader = ({ column, title }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {title}
    <ArrowUpDown />
  </Button>
);

export const columns = [
  {
    id: "index",  // Menambahkan kolom dengan ID "index"
    header: "#",  // Nama kolom untuk nomor urut
    cell: ({ row }) => row.index + 1,  // Mengambil index dan menambahkan 1 (untuk mulai dari 1, bukan 0)
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: ({row}) => <img src={row.original.images[0].url} className="rounded-sm w-16 h-16 object-cover" alt="Image" title={row.original.name} />
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
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} title="Price" />,
    cell: ({row}) => 'Rp '+new Intl.NumberFormat('en-US').format(row.original.price)
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => <SortableHeader column={column} title="Category" />,
    cell: ({row}) => row.original.category.name
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column} title="Quantity" />,
    cell: ({row}) => row.original.quantity
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({row}) => row.original.isFeatured
    ? <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full"><Check className="w-5 h-5" /></span>
    : <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full"><X className="w-5 h-5" /></span>
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({row}) => row.original.isArchived
    ? <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full"><Check className="w-5 h-5" /></span>
    : <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full"><X className="w-5 h-5" /></span>
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
