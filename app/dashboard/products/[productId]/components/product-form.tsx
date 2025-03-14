"use client"

import toast from "react-hot-toast";
import React, { useState } from "react";
import { useParams, useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import FileInput from "@/components/file-input";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Category, Product } from "@/app/types";
import { useSession } from "next-auth/react";

interface ProductFormProps {
  categories: Category[];
  initialData: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({categories, initialData}) => {
  const maxFiles = 5;
  const formSchema = z.object({
    name: z.string().min(1),
    images: initialData ? z.any() : 
    z.array(z.instanceof(File))
    .min(1, 'Please upload at least one file.')
    .max(maxFiles, `You can upload up to ${maxFiles} files.`)
    .refine((files) => files.every((file) => file.type.startsWith('image/')), {
      message: 'Only image files are allowed.',
    }),
    price: z.coerce.number().min(1),
    categoryId: z.coerce.number().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    description: z.string().min(1),
    quantity: z.coerce.number().min(0),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { handleError } = useErrorHandler();
  const { data: session } = useSession();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      categoryId: 0,
      price: 0,
      images: [],
      isFeatured: false,
      isArchived: false,
      description: '',
      quantity: 0
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let response;
      if (initialData) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.productId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
          }
        });
      } else {
        // Append images to the FormData
        const base64Images = [];

        for (const file of data.images) {
          const reader = new FileReader();
          const base64Promise = new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          base64Images.push(base64Promise);
        }

        // Menunggu semua Promise selesai
        const resolvedBase64Images = await Promise.all(base64Images);
        // Update data.images dengan base64 hasil konversi
        data.images = resolvedBase64Images;

        // Mengirim data ke server setelah gambar selesai diproses
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token}`
          }
        });
      }

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Success to insert data');
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1000);
      } else {
        // Menampilkan error toast untuk setiap field yang gagal
        handleError(responseData.errors);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <FileInput name={field.name} maxFiles={maxFiles} images={initialData?.images || []} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (Rp)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter price (Rp)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({field}) => (
               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Featured
                  </FormLabel>
                  <FormDescription>
                    This product will appear on the home page
                  </FormDescription>
                </div>
               </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({field}) => (
               <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Archived
                  </FormLabel>
                  <FormDescription>
                    This product will be archived
                  </FormDescription>
                </div>
               </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ProductForm