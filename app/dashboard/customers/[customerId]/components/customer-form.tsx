"use client"

import toast from "react-hot-toast";
import React, { useState } from "react";
import { useParams, useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Customer } from "@/app/types";

interface CustomerFormProps {
  initialData: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({initialData}) => {
  const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    password: z.string().min(6),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { handleError } = useErrorHandler();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let response;
      if (initialData) {
        response = await fetch(`/api/data/customers/${params.customerId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          }
        });
      } else {
        response = await fetch("/api/data/customers", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          }
        });
      }

      if (response.ok) {
        toast.success('Success to insert data');
        setTimeout(() => {
          router.push("/dashboard/customers");
        }, 1000);
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
                    <Input type="text" placeholder="Enter customer name" {...field} />
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
                    <Input type="email" placeholder="Enter email" {...field} />
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
            {
              !initialData && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              )
            }
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

export default CustomerForm