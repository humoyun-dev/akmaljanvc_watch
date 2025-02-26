"use client";

import { Suspense } from "react";
import SearchPage from "@/components/search";

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
