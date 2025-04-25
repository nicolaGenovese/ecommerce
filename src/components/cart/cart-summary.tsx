"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { cart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalPrice = cart?.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  ) || 0;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <div className="text-base font-medium text-gray-900">
            {formatPrice(totalPrice)}
          </div>
        </div>
      </div>
      <Button
        onClick={handleCheckout}
        disabled={!cart || cart.items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};