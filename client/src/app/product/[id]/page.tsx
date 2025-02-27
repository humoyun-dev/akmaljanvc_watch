"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import MobileNavbar from "@/components/mobile-nav";
import { use, useEffect, useState } from "react";
import type { Product } from "@/lib/data";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import AddToCartButton from "@/components/add-cart";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  // React.use() yordamida params ni ochish
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, status } = await axios.get(
          `${process.env.API}products/products/${resolvedParams.id}/`,
          {
            signal: controller.signal,
          },
        );

        if (status === 200) {
          setProduct(data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Mahsulotni yuklashda xatolik",
          );
        } else {
          setError("Kutilmagan xatolik yuz berdi");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();

    return () => controller.abort();
  }, [resolvedParams.id]); // resolvedParams dan foydalanish uchun dependency yangilandi

  return (
    <div className="pb-16">
      <MobileNavbar />
      <div className="container px-4 pt-4">
        {isLoading ? (
          <ProductSkeleton />
        ) : product ? (
          <ProductDetails product={product} />
        ) : null}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      <Skeleton className="aspect-square w-full rounded-lg" />

      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>

      <Skeleton className="h-20 w-full" />

      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-xl font-bold">{product.name}</h1>
        <p className="text-sm text-muted-foreground">
          {product.brand.name} · {product.category.name}
        </p>
      </div>

      <div className="relative aspect-square mb-4">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">
          UZS {Number(product.price).toLocaleString()}
        </div>
        <Badge variant={product.is_in_stock ? "default" : "secondary"}>
          {product.is_in_stock ? "Mavjud" : "Mavjud emas"}
        </Badge>
      </div>

      <p className="text-sm mb-6">{product.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <ProductSpecification label="Material" value={product.material} />
        <ProductSpecification
          label="Suvga chidamlilik"
          value={`${product.water_resistance}m`}
        />
        <ProductSpecification
          label="Yuzaning o'lchami"
          value={`${product.dial_size}mm`}
        />
        <ProductSpecification label="Og'irligi" value={`${product.weight}g`} />
      </div>

      <AddToCartButton product={product} />
    </>
  );
}

function ProductSpecification({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium capitalize">{value}</div>
    </div>
  );
}
