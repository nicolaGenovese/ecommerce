import { create } from "zustand";
import { toast } from "react-hot-toast";
import { Order } from "@/types";

interface OrdersStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (address: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

export const useOrders = create<OrdersStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  fetchOrders: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/orders");
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const orders = await response.json();
      set({ orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrder: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      
      const order = await response.json();
      set({ currentOrder: order });
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (address: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      const order = await response.json();
      
      // Update orders list
      const orders = get().orders;
      set({ orders: [order, ...orders] });
      
      toast.success("Order placed successfully!");
      return true;
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to place order");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      
      // Update orders list
      const orders = get().orders.map(order => 
        order.id === id ? updatedOrder : order
      );
      
      // Update current order if it's the one being viewed
      if (get().currentOrder?.id === id) {
        set({ currentOrder: updatedOrder });
      }
      
      set({ orders });
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      set({ isLoading: false });
    }
  },
}));