"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import { Container } from "@/components/ui/container";
import { useCart } from "@/hooks/use-cart";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const { cart, fetchCart } = useCart();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (session) {
      fetchCart();
    }
  }, [session, fetchCart]);

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "Products",
      active: pathname === "/products",
    },
  ];

  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  if (!mounted) {
    return null;
  }

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
              <p className="font-bold text-xl">STORE</p>
            </Link>
            <nav className="hidden md:flex md:gap-x-4 md:ml-10">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    route.active ? "text-black" : "text-neutral-500"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
              {session?.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/admin" ? "text-black" : "text-neutral-500"
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {session ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                      <p className="text-sm">Signed in as</p>
                      <p className="truncate text-sm font-medium text-gray-900">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/orders"
                            className={`${
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                            } block px-4 py-2 text-sm`}
                          >
                            My Orders
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={`${
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                            } block w-full text-left px-4 py-2 text-sm`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};