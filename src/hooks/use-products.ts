import { create } from "zustand";
import { toast } from "react-hot-toast";
import { Product, Category } from "@/types";

interface ProductsStore {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  fetchProducts: (categoryId?: string, search?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProducts = create<ProductsStore>((set) => ({
  products: [],
  categories: [],
  isLoading: false,

  fetchProducts: async (categoryId?: string, search?: string) => {
    try {
      set({ isLoading: true });
      
      let url = "/api/products";
      const params = new URLSearchParams();
      
      if (categoryId) {
        params.append("categoryId", categoryId);
      }
      
      if (search) {
        params.append("search", search);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      
      const products = await response.json();
      set({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/categories");
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      
      const categories = await response.json();
      set({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      set({ isLoading: false });
    }
  },
}));