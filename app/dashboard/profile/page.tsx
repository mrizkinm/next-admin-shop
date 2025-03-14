"use client"

import React from 'react';
import PageContainer from '@/components/page-container';
import Heading from '@/components/heading';
import ProfileForm from './components/profile-form';
import ProfileSkeleton from './components/profile-skeleton';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';

const ProfilePage = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Heading
          title="Profile"
          description="User profile's information"
        />
        <Separator />
        {user
          ? <ProfileForm initialData={{ ...user, id: user.id!, email: user.email ?? '', name: user.name ?? '' }} />
          : <ProfileSkeleton />  
        }
      </div>
    </PageContainer>
  )
}

export default ProfilePage