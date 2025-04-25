"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, isLoading } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!session) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    
    addItem(product);
  };

  return (
    <div className="group cursor-pointer rounded-xl border p-3 space-y-4">
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="sm"
              isLoading={isLoading}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Link href={`/products/${product.id}`}>
          <p className="font-semibold text-lg">{product.name}</p>
        </Link>
        <p className="text-sm text-gray-500">{product.category?.name}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};