export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
};

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type Order = {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  total: number;
  status: OrderStatus;
  address: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};