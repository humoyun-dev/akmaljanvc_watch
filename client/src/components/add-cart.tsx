"use client";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/data";
import { useCart } from "@/providers/cart.provider";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full py-6 text-base"
      disabled={!product.is_in_stock}
    >
      {product.is_in_stock ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
