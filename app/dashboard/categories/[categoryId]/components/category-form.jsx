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

const CategoryForm = ({initialData}) => {
  const formSchema = z.object({
    name: z.string().min(1)
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let response;
      if (initialData) {
        response = await fetch(`/api/data/categories/${params.categoryId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await fetch("/api/data/categories", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Success to insert data');
        setTimeout(() => {
          router.push("/dashboard/categories");
        }, 1000);
      } else {
        toast.error(responseData.error);
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

export default CategoryForm