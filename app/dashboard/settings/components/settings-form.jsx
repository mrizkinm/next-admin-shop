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

const SettingsForm = ({initialData}) => {
  const formSchema = z.object({
    name: z.string()
      .min(3, { message: 'Nama minimal 3 karakter' })
      .max(50, { message: 'Nama maksimal 50 karakter' }),
    address: z.string()
      .min(1),
    phone: z.string()
      .max(15)
  });

  const [ loading, setLoading ] = useState(false)
  const router = useRouter();
  const { handleError } = useErrorHandler();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      phone: ""
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/data/shop", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        toast.success('Success to update data');
        location.reload();
      } else {
        const { errors } = await response.json();
        // Menampilkan error toast untuk setiap field yang gagal
        handleError(errors);
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