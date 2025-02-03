export interface StoreInfo {
  name: string; // Nama toko
  address: string; // Alamat toko
  phone: string; // Nomor telepon toko
  email: string;
  image: string;
  description: string;
}

export interface Image {
  id: number;
  productId: number;
  url: string;
  createdAt: string;
  updatedAt: string;
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
  category: Category;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  images: Image[];
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  order: Order;
  productId: number;
  product: Product;
  quantity: number; // Jumlah item yang dipesan
  price: number; // Harga satuan saat dipesan
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string; // Nama pelanggan
  email?: string | null; // Email pelanggan, opsional
  phone?: string | null; // Nomor telepon pelanggan, opsional
  address?: string | null; // Alamat pelanggan, opsional
  orders: Order[]; // Relasi ke tabel Order
  password: string; // Kata sandi pelanggan
  token?: string | null; // Token opsional
  carts: Cart[]; // Relasi ke tabel Cart
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  customerId: number;
  customer?: Customer; // Relasi opsional ke Customer
  productId: number;
  product: Product;
  quantity: number; // Default 1
  createdAt: string;
  updatedAt: string;
}