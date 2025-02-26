"use client";

import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart.provider";

export default function MobileNavbar() {
  const { items } = useCart();
  const itemCount = items.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="container mx-auto flex items-center justify-between py-2 px-2">
        <Link href="/" className="font-bold text-lg">
          WatchShop
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
