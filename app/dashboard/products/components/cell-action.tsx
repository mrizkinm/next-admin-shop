"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertModal } from "@/components/alert-modal"
import Link from "next/link"
import { Product } from "@/app/types"
import { useSession } from "next-auth/react"

interface ProductProps {
  data: Product;
}

export const CellAction: React.FC<ProductProps> = ({data}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const onDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${data.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        router.refresh();
        toast.success('Success to delete data');
      } else {
        toast.error(responseData.error);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        title="Delete Product"
        description="Are you sure to delete this product?"
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}
      />
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
            <Link href={`/dashboard/products/${data.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() =>setOpen(true)} className="cursor-pointer">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}