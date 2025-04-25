"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, fetchCart, clearCart, isLoading } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchCart();
    } else {
      router.push("/login");
    }
  }, [session, fetchCart, router]);

  if (!session) {
    return null;
  }

  return (
    <Container>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 space-y-4">
                <p className="text-neutral-500">Your cart is empty.</p>
                <Link href="/products">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div>
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.id} className="py-6">
                      <CartItem item={item} />
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={() => router.push("/products")}
                    variant="outline"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => clearCart()}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <CartSummary />
          </div>
        </div>
      </div>
    </Container>
  );
}