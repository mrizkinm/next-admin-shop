"use client"

import Heading from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/column";
import PageContainer from '@/components/page-container'
import TableSkeleton from '@/components/table-skeleton'

const OrdersPage = () => {
  const [ data, setData] = useState([])
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api/data/orders", { method: "GET" });
  
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Gagal mendapatkan akses token baru:', error.message);
        throw error;
      } finally {
        setLoading(false)
      };
    };
    getData()
  }, [])

  const updateData = (id, updatedRow) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, ...updatedRow } : item))
    );
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Orders"
            description="List of order"
          />
        </div>
        <Separator />
        {!loading ? (
          <DataTable data={data} columns={columns(updateData)} searchKey="status" />
        ) : (
          <TableSkeleton columnCount={4} rowCount={10} />
        )}
      </div>
    </PageContainer>
  )
}

export default OrdersPage