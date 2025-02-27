"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/providers/cart.provider";
import MobileNavbar from "@/components/mobile-nav";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce(
    (total, item) =>
      total + Number.parseFloat(item.product.price) * item.quantity,
    0,
  );

  return (
    <div className="pb-16">
      <MobileNavbar />
      <div className="container mx-auto px-4 pt-4">
        <h1 className="text-2xl font-bold mb-4">Savatcha</h1>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">Savatingiz bo'sh</p>
            <Button asChild>
              <Link href="/">Savdo qilishni davom ettirish</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex border rounded-lg p-3 gap-3"
                >
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      UZS {Number(item.product.price).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Miqdorni kamaytirish</span>
                      </Button>
                      <span className="text-sm w-4 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Miqdorni oshirish</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Elementni olib tashlash</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Yig'indi</span>
                <span>UZS {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Yetkazib berish</span>
                <span>To'lov paytida hisoblanadi</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Jami</span>
                <span>UZS {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Button className="w-full py-6 text-base" asChild>
              <Link href="/checkout">To'lovga o'tish</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
