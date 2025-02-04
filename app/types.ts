export interface StoreInfo {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  image?: string | null; // Bisa null sesuai skema Prisma
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: number;
  productId: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  products?: Product[];
  name: string;
  image: string | null;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  categoryId: number;
  category?: Category; // Relasi ke Category
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  images?: Image[]; // Relasi ke Image
  description: string;
  quantity: number;
  orderItems?: OrderItem[]; // Relasi ke OrderItem
  carts?: Cart[]; // Relasi ke Cart
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  customerId: number; // Nullable jika memungkinkan pemesanan tanpa akun
  customer: Customer; // Relasi opsional ke tabel Customer
  info: Record<string, any>; // JSON data
  items: OrderItem[];
  totalAmount: number;
  status: string; // Status pesanan
  orderTrxId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  order: Order;
  productId: number;
  product: Product;
  quantity: number; // Jumlah item yang dipesan
  price: number; // Harga satuan saat dipesan
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[]; // Relasi ke Order
  carts?: Cart[];   // Relasi ke Cart
}

export interface Cart {
  id: number;
  customerId: number;
  customer?: Customer; // Relasi opsional ke Customer
  productId: number;
  product: Product;
  quantity: number; // Default 1
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string | null; // Bisa null sesuai skema Prisma
  createdAt: Date;
  updatedAt: Date;
}
