"use client"

import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';
import SettingsForm from './components/settings-form';
import SettingsSkeleton from './components/settings-skeleton';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  const [ data, setData] = useState({})
  const [ loading, setLoading ] = useState(true)

  const getData = async () => {
    try {
      const response = await fetch("/api/data/shop", { method: "GET" });

      const responseData = await response.json();
      setData(responseData[0]);
    } catch (error) {
      console.error('Gagal mendapatkan akses token baru:', error.message);
      throw error;
    } finally {
      setLoading(false)
    };
  };
  
  useEffect(() => {
    getData()
  }, [])

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title="Settings"
          description="Shop information settings"
        />
        <Separator />
        {!loading
          ? <SettingsForm initialData={data} />
          : <SettingsSkeleton />  
        }
      </div>
    </PageContainer>
  )
}

export default SettingsPage