import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import MobileNavbar from "@/components/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

interface OrderItem {
  id: number;
  product: number;
  quantity: number;
  price: string;
  total_price: string;
}

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  status: string;
  total_price: string;
  payment_method: string;
  shipping_address: string;
  billing_address: string;
  order_items: OrderItem[];
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}

function formatPaymentMethod(method: string) {
  return method
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function getOrder(orderId: string): Promise<Order> {
  const res = await fetch(`${process.env.API}/orders/orders/${orderId}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order data");
  }

  return res.json();
}

function LoadingState() {
  return (
    <div className="pb-16">
      <MobileNavbar />
      <div className="container px-4 pt-4 flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="h-16 w-16 text-muted-foreground animate-spin mb-4" />
        <h1 className="text-2xl font-bold mb-2">Loading Order Details...</h1>
        <p className="text-muted-foreground mb-6">
          Please wait while we fetch your order information.
        </p>
      </div>
    </div>
  );
}

function OrderDetails({ order, success }: { order: Order; success?: string }) {
  return (
    <div className="container px-4 pt-4 space-y-6">
      {Number(success) === 201 && (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Successful!</h1>
          <p className="text-muted-foreground mb-4">
            Thank you for your purchase. Your order has been received.
          </p>
          <Badge variant="outline" className="text-base px-4 py-1">
            Order #{order.id}
          </Badge>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>
              {order.first_name} {order.last_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{order.phone_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{order.shipping_address}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className={getStatusColor(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {formatPaymentMethod(order.payment_method)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Order Date</span>
            <span>{formatDate(order.created_at)}</span>
          </div>
          <Separator />
          <div className="space-y-2">
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Product #{item.product}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    {item.quantity} × UZS {Number(item.price).toLocaleString()}
                  </span>
                  <span className="font-medium">
                    UZS {Number(item.total_price).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between font-bold">
            <span>Total Amount</span>
            <span>UZS {Number(order.total_price).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Button asChild size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; success?: string };
}) {
  if (!searchParams.order) {
    return (
      <div className="pb-16">
        <MobileNavbar />
        <div className="container px-4 pt-4 text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <MobileNavbar />
      <Suspense fallback={<LoadingState />}>
        <OrderContent
          orderId={searchParams.order}
          success={searchParams.success}
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
  const order = await getOrder(orderId);
  return <OrderDetails order={order} success={success} />;
}
