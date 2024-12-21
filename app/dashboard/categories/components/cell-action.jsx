"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export const CellAction = ({data}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const params = useParams()

  const onCopy = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Banner id berhasil dicopy")
  }

  // const onDelete = async () => {
  //   try {
  //     setLoading(true)
  //     await axios.delete(`/api/data/categories/${data.id}`);
  //     router.refresh()
  //     toast.success('Banner berhasil dihapus')
  //   } catch (error) {
  //     setLoading(false)
  //     toast.error("Ada error")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              Action
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/dashboard/categories/${data.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() =>setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}