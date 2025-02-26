import type { Product } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <Link
          href={`/product/${product.id}`}
          key={product.id}
          className="block"
        >
          <div className="border rounded-lg overflow-hidden h-full flex flex-col">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 flex flex-col flex-grow">
              <h3 className="font-medium text-sm line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {product.description}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold">
                  UZS {Number(product.price).toLocaleString()}
                </span>
                {!product.is_in_stock ? (
                  <Badge variant="secondary">Out of stock</Badge>
                ) : null}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
