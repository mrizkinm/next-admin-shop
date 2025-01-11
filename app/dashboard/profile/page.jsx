"use client"

import React from 'react';
import { useUserData } from '../../../context/user-data-context';
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';
import ProfileForm from './components/profile-form';
import ProfileSkeleton from './components/profile-skeleton';
import { Separator } from '@/components/ui/separator';

const ProfilePage = () => {
  const { user } = useUserData();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title="Profile"
          description="User profile's information"
        />
        <Separator />
        {user
          ? <ProfileForm initialData={user} />
          : <ProfileSkeleton />  
        }
      </div>
    </PageContainer>
  )
}

export default ProfilePage