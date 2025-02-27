"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/providers/cart.provider";
import MobileNavbar from "@/components/mobile-nav";
import { Loader2, ShoppingBag } from "lucide-react";
import PhoneNumber from "@/components/phone-number";
import { getUserData } from "@/lib/storage";

const formSchema = z.object({
  first_name: z
    .string()
    .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  last_name: z
    .string()
    .min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone_number: z
    .string()
    .regex(/^\+?[0-9]{10,}$/, "Noto'g'ri telefon raqami formati"),
  shipping_address: z
    .string()
    .min(5, "Manzil kamida 5 ta belgidan iborat bo'lishi kerak"),
  payment_method: z.enum([
    "cash_on_delivery",
    "credit_card",
    "paypal",
    "other",
  ]),
});

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usingTelegram, setUsingTelegram] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      shipping_address: "",
      payment_method: "cash_on_delivery",
    },
  });

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      form.setValue("phone_number", userData.phone);
      setChatId(userData.chatId);
    }
  }, [form, chatId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const orderData = {
      ...values,
      status: "pending",
      order_items: items.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        `${process.env.API}/orders/orders/`,
        orderData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 201) {
        const subtotal = items.reduce(
          (total, item) =>
            total + Number.parseFloat(item.product.price) * item.quantity,
          0,
        );

        const telegramMessage = `
🛒 Buyurtmangiz qabul qilindi!
------------------------------
Ism: ${values.first_name} ${values.last_name}
Telefon raqami: ${values.phone_number}
Yetkazib berish manzili: ${values.shipping_address}
To'lov usuli: ${values.payment_method}
------------------------------
Buyurtma mahsulotlari:
${items
  .map(
    (item) =>
      `- ${item.product.name} × ${item.quantity} = UZS ${Number(
        (Number.parseFloat(item.product.price) * item.quantity).toFixed(2),
      ).toLocaleString()}`,
  )
  .join("\n")}
------------------------------
Jami: UZS ${subtotal.toLocaleString()}
`;

        if (chatId) {
          await axios.post("/api/telegram", {
            message: telegramMessage,
            chat_id: chatId,
          });
        }

        clearCart();
        router.push(
          `/checkout/success?order=${response.data.id}&success=${response.status}`,
        );
      }
    } catch (error) {
      console.error("Buyurtmani yuborishda xatolik:", error);
      alert(
        "Buyurtmani yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pb-16">
        <MobileNavbar />
        <div className="container px-4 pt-4 text-center py-8">
          <div className="mb-6">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-4">Savat bo'sh</p>
          </div>
          <Button asChild>
            <Link href="/">Do'kon sahifasiga qaytish</Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce(
    (total, item) =>
      total + Number.parseFloat(item.product.price) * item.quantity,
    0,
  );

  return (
    <div className="pb-16">
      <MobileNavbar />
      <div className="container mx-auto px-4 pt-4">
        <h1 className="text-2xl font-bold mb-6">Buyurtma berish</h1>

        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Buyurtma ma'lumotlari</CardTitle>
              <CardDescription>
                Jami: UZS {subtotal.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>
                      UZS{" "}
                      {Number(
                        (
                          Number.parseFloat(item.product.price) * item.quantity
                        ).toFixed(2),
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Form fields remain the same */}
              <Card>
                <CardHeader>
                  <CardTitle>Kontakt ma'lumotlari</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ism</FormLabel>
                        <FormControl>
                          <Input placeholder="Ismingizni kiriting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Familiya</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Familiyangizni kiriting"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon raqami</FormLabel>
                        <FormControl>
                          <PhoneNumber {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yetkazib berish manzili</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="shipping_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manzil</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="To'liq manzilingizni kiriting"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>To'lov usuli</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="To'lov usulini tanlang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash_on_delivery">
                              Naqd to'lov
                            </SelectItem>
                            <SelectItem value="credit_card">
                              Kredit karta
                            </SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="other">Boshqa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {!usingTelegram && (
                <Button
                  type="submit"
                  className="w-full py-6 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Jarayonda...
                    </>
                  ) : (
                    "Buyurtmani Yakunlash"
                  )}
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
