'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { jwtVerify } from 'jose';

interface UserObject {
  id: number;
  email: string;
  name: string;
}

interface UserContextType {
  user: UserObject | null;
  loading: boolean;
  error: string;
}

const UserDataContext = createContext<UserContextType | null>(null); // Membuat Context Global

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserContextType['user']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserData();
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
        try {
          await getNewAccessToken();
          await fetchUserData();
        } catch (error) {
          setError('Gagal mendapatkan token baru');
          console.error('Error mendapatkan token baru:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) throw new Error('Access token tidak ditemukan');

      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET)
      );

      console.log('User Payload:', payload);
      const userObject: UserObject = {
        id: payload.id as number,
        email: payload.email as string,
        name: payload.name as string,
      };
      setUser(userObject);
    } catch (error: any) {
      console.error('Gagal verifikasi JWT token:', error.message);
      throw error;
    }
  };

  const getNewAccessToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh-token", { method: "GET" });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Data dari refresh-token API:', responseData);

      return responseData;
    } catch (error: any) {
      console.error('Gagal mendapatkan akses token baru:', error.message);
      throw error;
    }
  };

  return (
    <UserDataContext.Provider value={{ user, loading, error }}>
      {children}
    </UserDataContext.Provider>
  );
};
