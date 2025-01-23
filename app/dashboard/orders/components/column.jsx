"use client"

import { Button } from "@/components/ui/button"
import { CellAction } from "./cell-action"
import { format } from "date-fns"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const SortableHeader = ({ column, title }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {title}
    <ArrowUpDown />
  </Button>
);

export const columns = (updateData) => [
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
    accessorKey: "orderTrxId",
    header: ({ column }) => <SortableHeader column={column} title="Order ID" />,
    cell: ({row}) => row.original.orderTrxId
  },
  {
    accessorKey: "customerId",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({row}) => {
      const customerName = row.original.customer?.name || row.original.guestInfo?.name || 'Unknown';
      return customerName;
    }
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <SortableHeader column={column} title="Total Amount" />,
    cell: ({row}) => 'Rp '+new Intl.NumberFormat('en-US').format(row.original.totalAmount)
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors = {
        Pending: 'bg-yellow-500 text-white hover:bg-yellow-600',
        Processed: 'bg-green-500 text-white hover:bg-green-600',
        Canceled: 'bg-red-500 text-white hover:bg-red-600',
      };
    
      const badgeClass = statusColors[status] || 'bg-gray-500 text-white';
    
      return <Badge className={badgeClass}>{status}</Badge>;
    }
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} updateData={updateData} />
  }
]
