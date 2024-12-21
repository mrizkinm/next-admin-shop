"use client"

import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  name: z.string().min(1)
});

const AddCategories = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Perform login request (replace with actual API call)
      const response = await fetch("/api/data/categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

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
    <div className="h-full p-4 md:px-6">
      <div className="space-y-4">
        <Heading
          title="Add Categories"
          description="Add new categories"
        />
        <Separator />
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
      </div>
    </div>
  )
}

export default AddCategories