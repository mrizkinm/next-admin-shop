"use client"

import React, { useEffect, useState} from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import PageContainer from '@/components/page-container';
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Boxes, List, ShoppingBag, Users2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from 'next-auth/react';
import { useErrorHandler } from '@/hooks/use-error-handler';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  interface DashboardData {
    summary: {
      totalCategories: number;
      totalProducts: number;
      totalOrders: number;
      totalCustomers: number;
    };
    recentOrders: {
      id: string;
      orderTrxId: string;
      customer: { name: string };
      totalAmount: number;
      status: string;
      createdAt: string;
    }[];
  }

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const statusColors = {
    Pending: 'bg-yellow-500 text-white hover:bg-yellow-600',
    Processed: 'bg-green-500 text-white hover:bg-green-600',
    Canceled: 'bg-red-500 text-white hover:bg-red-600',
  };

  const getData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/summary`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token}`
        }
      });

      const responseData = await response.json();

      if (response.ok) {
        setData(responseData);
      } else {
        // Menampilkan error toast untuk setiap field yang gagal
        handleError(responseData.errors);
        throw new Error("Gagal mengambil data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getData();
    }
  }, [status]);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back {user ? user.name : ''}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <List className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.totalCategories}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Boxes className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.totalProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.summary.totalCustomers}</div>
              </CardContent>
            </Card>
          </>
        )}
        </div>

        {/* Recent Orders Section */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <p className="text-muted-foreground text-sm">Last recent orders</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.recentOrders.map((order, index) => (
                      <TableRow key={order.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{order.orderTrxId}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>
                          Rp {new Intl.NumberFormat("en-US").format(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status as keyof typeof statusColors] || "bg-gray-500 text-white"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

export default Dashboard