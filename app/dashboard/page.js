"use client"

import { Button } from '@/components/ui/button';
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from './auth-context';

const Dashboard = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  
  const onLogout = async () => {
    try {
      const data ={
        id: user.id
      }
      // Perform login request (replace with actual API call)
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        // Redirect to dashboard or other protected page on success
        router.push("/login");
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  };

  return (
    <div className="p-5">
      <h1>Selamat Datang di Dashboard, Email: Welcome, {user ? user.email : ''}</h1>
      <Button type="button" onClick={() => onLogout()}>Logout</Button>
    </div>
  )
}

export default Dashboard