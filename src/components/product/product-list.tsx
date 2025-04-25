"use client";

import { Product } from "@/types";
import { ProductCard } from "./product-card";
import { useEffect } from "react";
import { useProducts } from "@/hooks/use-products";

interface ProductListProps {
  title: string;
  categoryId?: string;
  search?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  title,
  categoryId,
  search,
}) => {
  const { products, isLoading, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts(categoryId, search);
  }, [fetchProducts, categoryId, search]);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">{title}</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-neutral-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};