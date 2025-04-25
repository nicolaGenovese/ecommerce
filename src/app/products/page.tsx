"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { ProductList } from "@/components/product/product-list";
import { useProducts } from "@/hooks/use-products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductsPage() {
  const { categories, fetchCategories } = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (search) {
      params.set("search", search);
    }
    
    if (categoryId) {
      params.set("categoryId", categoryId);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";
    
    router.push(url);
  };

  const handleCategoryClick = (id: string | null) => {
    const params = new URLSearchParams();
    
    if (search) {
      params.set("search", search);
    }
    
    if (id) {
      params.set("categoryId", id);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";
    
    router.push(url);
  };

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="p-4 sm:p-6 lg:p-8 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-3xl font-bold">All Products</h1>
            <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                    !categoryId ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                      categoryId === category.id ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-3/4">
            <ProductList 
              title={categoryId ? categories.find(c => c.id === categoryId)?.name || "Products" : "All Products"} 
              categoryId={categoryId || undefined}
              search={search || undefined}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}