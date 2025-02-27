"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "@/lib/data";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const { data, status } = await axios.get(
          `${process.env.API}products/products/`,
        );
        if (status === 200) {
          setProducts(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch products"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
