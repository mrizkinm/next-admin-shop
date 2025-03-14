"use client"

import { useParams, useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast";
import React, { useState } from 'react';
import FileInput from '@/components/file-input';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { Category } from '@/app/types';
import { useSession } from 'next-auth/react';

interface CategoryFormProps {
  initialData: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({initialData}) => {
  const maxFiles = 1;
  const formSchema = z.object({
    name: z.string().min(1),
    images: initialData ? z.any() : 
    z.array(z.instanceof(File))
    .min(1, 'Please upload at least one file.')
    .max(maxFiles, `You can upload up to ${maxFiles} files.`)
    .refine((files) => files.every((file) => file.type.startsWith('image/')), {
      message: 'Only image files are allowed.',
    }),
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
      images: [],
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let response;
      if (initialData) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${params.categoryId}`, {
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

        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
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
          router.push("/dashboard/categories");
        }, 1000);
      } else {
        // Menampilkan error toast untuk setiap field yang gagal
        handleError(responseData.errors);
      }
    } catch (error) {
      console.log('errrorr');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileInput name={field.name} maxFiles={maxFiles} images={initialData?.image ? [ { url: initialData.image }] : []} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default CategoryForm