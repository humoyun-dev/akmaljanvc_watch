import { Suspense } from "react";
import MobileNavbar from "@/components/mobile-nav";
import Products, { ProductsSkeleton } from "@/components/products";

export default function Home() {
  return (
    <main className="pb-16">
      <MobileNavbar />
      <div className="container px-4 pt-4">
        <h1 className="text-2xl font-bold mb-4">Akmaljanvc Watches</h1>
        <Suspense fallback={<ProductsSkeleton />}>
          <Products />
        </Suspense>
      </div>
    </main>
  );
}
