"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, Eye, MoreHorizontal, X } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import { AlertModal } from "@/components/alert-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Order } from "@/app/types"
import { useSession } from "next-auth/react"
import { useErrorHandler } from "@/hooks/use-error-handler"

interface OrderProps {
  data: Order;
}

export const CellAction: React.FC<OrderProps> = ({data}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter()
  const { data: session } = useSession();
  const { handleError } = useErrorHandler();

  const handleAction = async (actionType: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/action`, {
        method: "POST",
        body: JSON.stringify({ action: actionType, id: data.id, items: data.items }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        router.refresh();
        toast.success(responseData.message);
      } else {
        handleError(responseData.errors);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onAction = (action: string) => {
    setAction(action);
    setTitle(action === "process" ? "Process Orders" : "Cancel Orders");
    setDescription(
      action === "process"
        ? "Are you sure to process this order?"
        : "Are you sure to cancel this order?"
    );
    setOpen(true);
  };

  return (
    <>
      <AlertModal
        title={title}
        description={description}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleAction(action)}
        loading={loading}
      />
      <DropdownMenu modal={false}>
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
            <Link href={`/dashboard/orders/${data.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Detail
              </DropdownMenuItem>
            </Link>
            {data.status === "Pending" && (
              <>
                <DropdownMenuItem onClick={() =>onAction('process')} className="cursor-pointer">
                  <Check className="mr-2 h-4 w-4" />
                  Process
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() =>onAction('cancel')} className="cursor-pointer">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}