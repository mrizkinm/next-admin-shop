"use client"

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtVerify } from 'jose';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Ambil token dari cookies
        const accessToken = Cookies.get('accessToken');
        console.log(accessToken);

        // Verifikasi JWT token
        const { payload } = await jwtVerify(
          accessToken,
          new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET)
        );
        console.log(payload)

        setUser(payload);
      } catch (err) {
        console.error('Error saat mengambil data user:', err);
        setError('Token tidak valid atau telah kedaluwarsa');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  const onSubmit = async () => {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Selamat Datang di Dashboard, Email: Welcome, {user ? user.email : ''}</h1>
      <Button type="button" onClick={() => onSubmit()}>Logout</Button>
    </div>
  )
}

export default Dashboard