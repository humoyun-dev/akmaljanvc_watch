"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/components/product-list";
import { saveUserData } from "@/lib/storage";
import { useProducts } from "@/lib/use-products";

export default function Products() {
  const searchParams = useSearchParams();
  const { products, isLoading } = useProducts();

  // Handle URL parameters and localStorage
  useEffect(() => {
    const phone = searchParams.get("phone");
    const chatId = searchParams.get("chatId");

    if (phone && chatId) {
      saveUserData({ phone, chatId });
    }
  }, [searchParams]);

  if (isLoading) {
    return <ProductsSkeleton />;
  }

  return <ProductList products={products} />;
}

export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}
