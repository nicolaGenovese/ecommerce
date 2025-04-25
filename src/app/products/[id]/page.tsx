"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!session) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    
    if (product) {
      addItem(product, quantity);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push("/products")}>
            Back to Products
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div className="aspect-square rounded-xl bg-gray-100 relative">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="aspect-square object-cover rounded-md"
            />
          </div>
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-3">
              <p className="text-3xl text-gray-900">{formatPrice(product.price)}</p>
            </div>
            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <p className="mt-4 text-base text-gray-500">{product.description}</p>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-x-3">
                <h3 className="text-sm font-medium text-gray-900">Category:</h3>
                <div>{product.category?.name}</div>
              </div>
              <div className="flex items-center gap-x-3 mt-4">
                <h3 className="text-sm font-medium text-gray-900">Availability:</h3>
                <div>{product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}</div>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-x-3">
              <Button
                onClick={decrementQuantity}
                variant="outline"
                size="sm"
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="text-gray-700">{quantity}</span>
              <Button
                onClick={incrementQuantity}
                variant="outline"
                size="sm"
                disabled={product.stock <= quantity}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-x-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isLoading}
                className="flex-1 max-w-xs"
                size="lg"
                isLoading={isLoading}
              >
                {product.stock === 0 ? "Out of stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}