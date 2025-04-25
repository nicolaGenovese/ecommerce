"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, fetchCart, isLoading: cartLoading } = useCart();
  const { createOrder, isLoading: orderLoading } = useOrders();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (session) {
      fetchCart();
    } else {
      router.push("/login");
    }
  }, [session, fetchCart, router]);

  const totalPrice = cart?.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  ) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!address.trim()) {
      setAddressError("Address is required");
      return;
    }
    
    setAddressError("");
    
    // Create order
    const success = await createOrder(address);
    
    if (success) {
      router.push("/orders");
    }
  };

  if (!session) {
    return null;
  }

  if (cartLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <p className="text-neutral-500">Your cart is empty.</p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">Checkout</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Shipping Address
                  </label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={addressError}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.id} className="py-4 flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.product.name} x {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.product.category?.name}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <Button
                  type="button"
                  onClick={() => router.push("/cart")}
                  variant="outline"
                >
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  isLoading={orderLoading}
                  disabled={orderLoading}
                >
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}