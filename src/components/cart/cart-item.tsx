"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, updateQuantity, isLoading } = useCart();

  const handleRemove = () => {
    removeItem(item.id);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={item.product.image || "/placeholder.png"}
          alt={item.product.name}
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <Button
            onClick={handleRemove}
            variant="ghost"
            size="sm"
            className="text-gray-500"
            disabled={isLoading}
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">
              {item.product.name}
            </p>
          </div>
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">
              {item.product.category?.name || "Category"}
            </p>
          </div>
          <div className="mt-1 flex items-end">
            <p className="text-lg font-medium text-gray-900">
              {formatPrice(item.product.price)}
            </p>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <Button
            onClick={handleDecreaseQuantity}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="mx-3 text-gray-700">{item.quantity}</span>
          <Button
            onClick={handleIncreaseQuantity}
            variant="outline"
            size="sm"
            disabled={isLoading || item.quantity >= item.product.stock}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};