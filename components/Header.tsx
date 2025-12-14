"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="STAR'Z Burger / Pizza & Shakes Logo"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
            <div>
              <h1 className="text-3xl font-bold">STAR'Z</h1>
              <p className="text-sm text-yellow-200">Burger / Pizza & Shakes</p>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/menu"
              className="hover:text-yellow-200 transition font-semibold"
            >
              Menu
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-secondary-light transition"
            >
              <ShoppingCart size={20} />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

