import { cookies } from "next/headers";

export async function getProducts(params: {
  categories?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const queryString = new URLSearchParams();
  if (params.categories) queryString.append('categories', params.categories.toString());
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/products?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `refreshToken=${refreshToken}`, // Kirim cookie ke API
    },
  });
  if (!response.ok) {
    throw new Error(JSON.stringify(response));
  }
  return response.json();
}

export async function getOrders(params: {
  status?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const queryString = new URLSearchParams();
  if (params.status) queryString.append('status', params.status.toString());
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/orders?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `refreshToken=${refreshToken}`, // Kirim cookie ke API
    },
  });
  if (!response.ok) {
    throw new Error(JSON.stringify(response));
  }
  return response.json();
}

export async function getCustomers(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const queryString = new URLSearchParams();
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/customers?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `refreshToken=${refreshToken}`, // Kirim cookie ke API
    },
  });
  if (!response.ok) {
    throw new Error(JSON.stringify(response));
  }
  return response.json();
}

export async function getCategories(params: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const queryString = new URLSearchParams();
  if (params.search) queryString.append('search', params.search);
  if (params.page) queryString.append('page', params.page.toString());
  if (params.limit) queryString.append('limit', params.limit.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/categories?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `refreshToken=${refreshToken}`, // Kirim cookie ke API
    },
  });
  if (!response.ok) {
    throw new Error(JSON.stringify(response));
  }
  return response.json();
}

export async function getStoreInfo() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/shop`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `refreshToken=${refreshToken}`, // Kirim cookie ke API
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch shop');
  }
  return response.json();
}