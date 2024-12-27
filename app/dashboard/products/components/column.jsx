"use client"

import { CellAction } from "./cell-action"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

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
    header: "Date",
    cell: ({row}) => format(row.original.createdAt, 'dd MMM yyyy HH:mm')
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({row}) => 'Rp '+new Intl.NumberFormat('en-US').format(row.original.price)
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({row}) => row.original.category.name
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({row}) => row.original.isFeatured ? <div className="rounded-full w-6 h-6 bg-green-600"><Check className="size-6 text-white" /></div> : <div className="rounded-full w-6 h-6 bg-destructive"><X className="size-6 text-white" /></div>
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({row}) => row.original.isArchived ? <div className="rounded-full w-6 h-6 bg-green-600"><Check className="size-6 text-white" /></div> : <div className="rounded-full w-6 h-6 bg-destructive"><X className="size-6 text-white" /></div>
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
