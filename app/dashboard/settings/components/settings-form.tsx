import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useErrorHandler } from '@/hooks/use-error-handler';
import FileInput from '@/components/file-input';
import { StoreInfo } from '@/app/types';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/shop-store';

interface SettingsFormProps {
  initialData: StoreInfo | null;
}

const SettingsForm: React.FC<SettingsFormProps> = ({initialData}) => {
  const maxFiles = 1;
  const formSchema = z.object({
    name: z.string()
      .min(3, { message: 'Nama minimal 3 karakter' })
      .max(50, { message: 'Nama maksimal 50 karakter' }),
    address: z.string().min(1),
    phone: z.string().max(15),
    email: z.string().min(1).email(),
    description: z.string().min(1),
    images: initialData ? z.any() : 
    z.array(z.instanceof(File))
    .min(1, 'Please upload at least one file.')
    .max(maxFiles, `You can upload up to ${maxFiles} files.`)
    .refine((files) => files.every((file) => file.type.startsWith('image/')), {
      message: 'Only image files are allowed.',
    }),
  });

  const [ loading, setLoading ] = useState(false)
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const { data: session } = useSession();
  const { setStore } = useStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      images: [],
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (data.images) {
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
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Success to update data');
        setStore(responseData);
        router.refresh()
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
    <Card>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileInput name={field.name} maxFiles={maxFiles} images={initialData?.image ? [ { url: initialData.image }] : []} />
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
                      <Input type="text" placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button type="submit" className="w-full flex gap-2" disabled={loading}>
              <Save className="h-4 w-4" /> {loading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SettingsForm