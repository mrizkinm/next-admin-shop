import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, User, Camera, Eye, EyeOff, Save } from "lucide-react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { getSession, signOut, useSession } from 'next-auth/react';

interface UserObject {
  id: number;
  email: string;
  name: string;
}

interface ProfileFormProps {
  initialData: UserObject | undefined;
}

const ProfileForm: React.FC<ProfileFormProps> = ({initialData}) => {
  const profileSchema = z.object({
    name: z.string()
      .min(3, { message: 'Nama minimal 3 karakter' })
      .max(50, { message: 'Nama maksimal 50 karakter' }),
    email: z.string()
      .email({ message: 'Format email tidak valid' }),
    id: z.number().int()
  });
  
  // Schema validasi untuk form password
  const passwordSchema = z.object({
    id: z.number().int(),
    currentPassword: z.string()
      .min(1, { message: 'Password saat ini harus diisi' }),
    newPassword: z.string()
      .min(6, { message: 'Password minimal 6 karakter' }),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const { data: session, update } = useSession();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      id: 0
    }
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      id: initialData?.id
    }
  });

  // const getNewAccessToken = async () => {
  //   try {
  //     const response = await fetch("/api/auth/refresh-token", { method: "GET" });

  //     if (!response.ok) {
  //       throw new Error(`Error ${response.status}: ${response.statusText}`);
  //     }

  //     const responseData = await response.json();

  //     return responseData;
  //   } catch (error: any) {
  //     console.error('Gagal mendapatkan akses token baru:', error.message);
  //     throw error;
  //   }
  // };

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        const newUserData = {
          ...session?.user,
          name: responseData.name,
          email: responseData.email
        };
    
        await update({ user: newUserData });
        toast.success('Success to update data');
        // await getNewAccessToken();
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

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/password`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('Success to update data');
        await onLogout();
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

  const onLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/logout`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        }
      });
      
      const responseData = await response.json();

      if (response.ok) {
        // Redirect to dashboard or other protected page on success
        await signOut({
          redirect: false
        });
        router.push("/login");
      } else {
        toast.error(responseData);
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  };

  return (
    <Card>
      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col items-center space-y-6 p-6 pb-2">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage />
              <AvatarFallback className="text-2xl">{initialData?.name.split(' ').map(word => word[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute bottom-0 right-0 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="flex gap-2">
              <User className="h-4 w-4" /> Edit Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="flex gap-2">
              <Mail className="h-4 w-4" /> Change Password
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4">
          <TabsContent value="profile">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <Input type="hidden" {...profileForm.register('id')} />
                <FormField
                  control={profileForm.control}
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
                  control={profileForm.control}
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

                <Button type="submit" className="w-full flex gap-2" disabled={loading}>
                  <Save className="h-4 w-4" /> {loading ? "Loading..." : "Save"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="password">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <Input type="hidden" {...passwordForm.register('id')} />
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showCurrentPassword ? "text" : "password"} placeholder="Enter current password" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showNewPassword ? "text" : "password"} placeholder="Enter new password" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm new password" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full flex gap-2" disabled={loading}>
                  <Save className="h-4 w-4" /> {loading ? "Loading..." : "Save New Password"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

export default ProfileForm