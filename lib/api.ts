// import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getProducts(params: {
  categories?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  // const cookieStore = await cookies();
  // const refreshToken = cookieStore.get("refreshToken")?.value;
  const session = await getServerSession(authOptions);
  const queryString = new URLSearchParams();
  if (params.categories) queryString.append('categories', params.categories.toString());
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getOrders(params: {
  status?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const session = await getServerSession(authOptions);
  const queryString = new URLSearchParams();
  if (params.status) queryString.append('status', params.status.toString());
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

export async function getCustomers(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const session = await getServerSession(authOptions);
  const queryString = new URLSearchParams();
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
}

export async function getCategories(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const session = await getServerSession(authOptions);
  const queryString = new URLSearchParams();
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function getStoreInfo() {
  const session = await getServerSession(authOptions);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch shop');
  }
  return response.json();
}

export async function getDetailCustomer(id: number) {
  const session = await getServerSession(authOptions);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch customer');
  }
  return response.json();
}

export async function getDetailOrder(id: number) {
  const session = await getServerSession(authOptions);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  return response.json();
}

export async function getDetailProduct(id: number) {
  const session = await getServerSession(authOptions);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
}

export async function getDetailCategory(id: number) {
  const session = await getServerSession(authOptions);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }
  return response.json();
}