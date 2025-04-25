"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/admin/check");
        
        if (!response.ok) {
          throw new Error("Not authorized");
        }
        
        setIsAdmin(true);
        fetchProducts();
      } catch (error) {
        console.error("Admin check error:", error);
        toast.error("You are not authorized to access this page");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Products fetch error:", error);
        toast.error("Failed to load products");
      }
    };

    checkAdmin();
  }, [session, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter products client-side for simplicity
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      
      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = search
    ? products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Container>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Container>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Manage Products</h1>
          <Link href="/admin/products/new">
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
        
        <div className="mt-8">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit">Search</Button>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.name || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="outline" size="sm">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
}