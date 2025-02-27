"use client";
import { Product } from "@/lib/data";
import MobileNavbar from "@/components/mobile-nav";
import ProductList from "@/components/product-list";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { saveUserData } from "@/lib/storage";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const searchParams = useSearchParams();

  // Handle URL parameters and localStorage
  useEffect(() => {
    const phone = searchParams.get("phone");
    const chatId = searchParams.get("chatId");

    if (phone && chatId) {
      saveUserData({ phone, chatId });
    }
  }, [searchParams]);

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
        <h1 className="text-2xl font-bold mb-4">Akmaljanvc Watches</h1>
        <ProductList products={products} />
      </div>
    </main>
  );
}
