import { create } from "zustand";
import { toast } from "react-hot-toast";
import { Cart, CartItem, Product } from "@/types";

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCart = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/cart");
      
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      
      const cart = await response.json();
      set({ cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load your cart");
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (product: Product, quantity = 1) => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add item to cart");
      }

      // Refresh the cart
      await get().fetchCart();
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      toast.error(error.message || "Failed to add item to cart");
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId: string) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Update the cart state
      const cart = get().cart;
      if (cart) {
        const updatedCart = {
          ...cart,
          items: cart.items.filter(item => item.id !== itemId),
        };
        set({ cart: updatedCart });
      }

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      set({ isLoading: true });
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update quantity");
      }

      const updatedItem = await response.json();

      // Update the cart state
      const cart = get().cart;
      if (cart) {
        const updatedCart = {
          ...cart,
          items: cart.items.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          ),
        };
        set({ cart: updatedCart });
      }

      toast.success("Cart updated");
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      toast.error(error.message || "Failed to update quantity");
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      // Update the cart state
      const cart = get().cart;
      if (cart) {
        const updatedCart = {
          ...cart,
          items: [],
        };
        set({ cart: updatedCart });
      }

      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      set({ isLoading: false });
    }
  },
}));