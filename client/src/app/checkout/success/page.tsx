import { Suspense } from "react";
import { notFound } from "next/navigation";
import MobileNavbar from "@/components/mobile-nav";
import OrderDetails from "@/components/order/detail";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; success?: string }>;
}) {
  const resolvedParams = await searchParams;

  if (!resolvedParams.order) {
    return (
      <div className="pb-16">
        <MobileNavbar />
        {/*<OrderNotFound />*/}
      </div>
    );
  }

  return (
    <div className="pb-16">
      <MobileNavbar />
      <Suspense
        fallback={
          <>
            <p>Loading ...</p>
          </>
        }
      >
        <OrderContent
          orderId={resolvedParams.order}
          success={resolvedParams.success}
        />
      </Suspense>
    </div>
  );
}

async function OrderContent({
  orderId,
  success,
}: {
  orderId: string;
  success?: string;
}) {
  try {
    const order = await getOrder(orderId);
    return <OrderDetails order={order} success={success} />;
  } catch (error) {
    notFound();
  }
}

async function getOrder(orderId: string) {
  const API_URL = process.env.API || "";

  const res = await fetch(`${API_URL}/orders/orders/${orderId}/`, {
    next: {
      revalidate: 60, // Revalidate every minute
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch order data: ${res.status}`);
  }

  return res.json();
}
