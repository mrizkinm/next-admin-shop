"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image";
import toast from "react-hot-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";

const Login = () => {
  const formSchema = z.object({
    email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
    password: z.string().min(6, "Password harus memiliki minimal 6 karakter"),
  });

  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Perform login request (replace with actual API call)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success('Login sukses');
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        const { errors } = await response.json();
        handleError(errors);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-slate-950 shadow-lg rounded-lg mx-5">
        <div className="flex flex-col space-y-2 items-center">
          <Image src="/img/gundam.png" width={100} height={100} alt="Logo" />
          <h1 className="text-2xl font-semibold tracking-tight">Shop</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Password */}
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

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Login