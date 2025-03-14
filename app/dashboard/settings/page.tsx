"use client"

import React, { Suspense } from 'react';
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';
import SettingsForm from './components/settings-form';
import SettingsSkeleton from './components/settings-skeleton';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/shop-store';

const SettingsPage = () => {
  const { storeInfo } = useStore();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title="Settings"
          description="Shop information settings"
        />
        <Separator />
        {storeInfo != null
          ? <SettingsForm initialData={storeInfo} />
          : <SettingsSkeleton />  
        }
      </div>
    </PageContainer>
  )
}

export default SettingsPage