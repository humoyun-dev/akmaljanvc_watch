"use client";
import { Product } from "@/lib/data";
import MobileNavbar from "@/components/mobile-nav";
import ProductList from "@/components/product-list";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  async function getProducts() {
    try {
      const { data, status } = await axios.get(
        `${process.env.API}products/products/`,
      );
      if (status === 200) {
        setProducts(data);
      }
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <main className="pb-16">
      <MobileNavbar />
      <div className="container px-4 pt-4">
        <h1 className="text-2xl font-bold mb-4">Luxury Watches</h1>
        <ProductList products={products} />
      </div>
    </main>
  );
}
