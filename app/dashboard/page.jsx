"use client"

import React, { useContext } from 'react'
import { UserDataContext } from './user-data-context';

const Dashboard = () => {
  const { user } = useContext(UserDataContext);

  return (
    <div className="p-5">
      <h1>Selamat Datang di Dashboard, Welcome, {user ? user.email : ''}</h1>
    </div>
  )
}

export default Dashboard