"use client"

import { CellAction } from "./cell-action"
import { format } from "date-fns"

export const columns = [
  {
    id: "index",  // Menambahkan kolom dengan ID "index"
    header: "#",  // Nama kolom untuk nomor urut
    cell: ({ row }) => row.index + 1,  // Mengambil index dan menambahkan 1 (untuk mulai dari 1, bukan 0)
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
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />
  }
]
