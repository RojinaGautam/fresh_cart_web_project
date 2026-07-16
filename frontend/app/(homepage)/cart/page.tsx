"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
  FiMapPin,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { useCart } from "@/lib/contexts/CartContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { createOrderAction } from "@/lib/actions/orders-action";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

const checkoutDetailsKey = "freshcart_checkout_details";

type CheckoutDetails = {
  address: string;
  paymentMethod: string;
  deliveryDate: string;
  deliveryTime: string;
};

export const formatSavedAddress = (savedAddress: { street: string; city: string }) =>
  `${savedAddress.street}, ${savedAddress.city}`;

export const getMinDeliveryDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CartPage() {
  const router = useRouter();
  const { cart, updateItem, removeItem, refetch } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card ending in 4242");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("09:00-11:00");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const cartItems = cart?.items || [];
  const savedAddresses = user?.addresses || [];
  const minDeliveryDate = useMemo(() => getMinDeliveryDate(), []);

  useEffect(() => {
    let timeoutId: number | undefined;

    try {
      const stored = window.localStorage.getItem(checkoutDetailsKey);
      if (!stored) return;

      const details = JSON.parse(stored) as Partial<CheckoutDetails>;
      timeoutId = window.setTimeout(() => {
        setAddress(details.address || "");
        setPaymentMethod(details.paymentMethod || "Card ending in 4242");
        const restoredDate = details.deliveryDate || "";
        setDeliveryDate(restoredDate >= minDeliveryDate ? restoredDate : "");
        setDeliveryTime(details.deliveryTime || "09:00-11:00");
      }, 0);
    } catch {
      // Keep checkout fields usable even if saved browser data is invalid.
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [minDeliveryDate]);

  useEffect(() => {
    window.localStorage.setItem(
      checkoutDetailsKey,
      JSON.stringify({
        address,
        paymentMethod,
        deliveryDate,
        deliveryTime,
      }),
    );
  }, [address, paymentMethod, deliveryDate, deliveryTime]);

  const deliveryFee = 3.5;
  const freshSavings = 2;

  const subtotal = useMemo(() => cart?.subtotal || 0, [cart]);
  const total =
    cartItems.length > 0 ? Math.max(subtotal + deliveryFee - freshSavings, 0) : 0;

  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      void removeItem(productId);
      return;
    }

    void updateItem(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    void removeItem(productId);
  };

  const handleCheckout = async () => {
    setCheckoutError("");
    setOrderNumber("");

    if (!address.trim()) {
      setCheckoutError("Please add a delivery address.");
      return;
    }

    if (!deliveryDate) {
      setCheckoutError("Please choose a delivery date.");
      return;
    }

    if (deliveryDate < minDeliveryDate) {
      setCheckoutError("Please choose a future delivery date.");
      return;
    }

    setPlacingOrder(true);

    const response = await createOrderAction({
      shippingAddress: address,
      paymentMethod,
      deliveryDate,
      deliveryTimeSlot: deliveryTime,
    });

    setPlacingOrder(false);

    if (!response.success) {
      setCheckoutError(response.message || "Unable to place order.");
      return;
    }

    setOrderNumber(response.data.orderNumber);
    await refetch();
    router.push("/dashboard/profile");
  };

  return (
    <ProtectedRoute>
    <div className="space-y-8">
      <section className="overflow-hidden rounded-md bg-[#d9e4d7]">
        <div className="relative min-h-[280px] px-7 py-9 sm:px-10">
          <Image
            src="/images/deals/grocery-aisle-hero.png"
            alt="Fresh groceries cart"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#dfeadb] px-4 py-2 text-xs font-bold text-green-800 transition hover:bg-[#d3e2cf]"
              >
                <FiArrowLeft size={14} />
                Continue shopping
              </Link>
              <h1 className="mt-5 text-3xl font-bold leading-tight text-[#15251b] sm:text-4xl">
                Your FreshCart Basket
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                Review your cart, add your delivery address, choose payment,
                and schedule your delivery time.
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-[#d8e2d4]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <FiShoppingCart size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#15251b]">
                    {cartItems.length} item{cartItems.length === 1 ? "" : "s"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {cartItems.length ? "Ready for checkout" : "Cart is empty"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_390px]">
        <div className="rounded-3xl border border-[#d8e2d4] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#eef2ea] pb-4">
            <h2 className="text-xl font-semibold text-[#15251b]">
              Cart Items
            </h2>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8e2d4] bg-[#f7faf4] px-6 py-12 text-center">
              <FiShoppingCart className="text-green-700" size={34} />
              <h3 className="mt-4 text-xl font-semibold text-[#15251b]">
                Your cart is empty
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Add products from Trending Now or category pages. They will
                appear here instantly.
              </p>
              <Link
                href="/"
                className="mt-5 rounded-full bg-[#173822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d1b]"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#eef2ea]">
              {cartItems.map((item) => (
                <article
                  key={item.product.id}
                  className="grid gap-4 py-5 sm:grid-cols-[96px_1fr_auto] sm:items-center"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[#eef2ea]">
                    <Image
                      src={resolveImageUrl(item.product.image)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="mt-1 text-base font-semibold text-[#15251b]">
                      {item.product.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.product.id)}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-500 transition hover:text-red-600"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-lg font-semibold text-green-800">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 rounded-full border border-[#d8e2d4] bg-[#f7faf4] p-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantity(item.product.id, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantity(item.product.id, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173822] text-white shadow-sm"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-[#d8e2d4] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[#15251b]">
              Order Summary
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>${cartItems.length ? deliveryFee.toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fresh savings</span>
                <span className="text-green-800">
                  -${cartItems.length ? freshSavings.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="border-t border-[#eef2ea] pt-3">
                <div className="flex justify-between text-lg font-semibold text-[#15251b]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {checkoutError && (
              <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {checkoutError}
              </p>
            )}
            {orderNumber && (
              <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                Order {orderNumber} placed successfully!
              </p>
            )}

            <button
              type="button"
              disabled={cartItems.length === 0 || placingOrder}
              onClick={handleCheckout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d1b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiCreditCard size={16} />
              {placingOrder ? "Placing order..." : "Checkout"}
            </button>
          </div>

          <div className="rounded-3xl border border-[#d8e2d4] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfeadb] text-green-800">
                <FiMapPin size={19} />
              </span>
              <div>
                <h3 className="font-semibold text-[#15251b]">
                  Delivery Address
                </h3>
                <p className="text-sm text-gray-500">Add where we should deliver.</p>
              </div>
            </div>

            {savedAddresses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {savedAddresses.map((savedAddress) => {
                  const formatted = formatSavedAddress(savedAddress);
                  const isSelected = address === formatted;

                  return (
                    <button
                      key={savedAddress.id}
                      type="button"
                      onClick={() => setAddress(formatted)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? "border-emerald-600 bg-[#173822] text-white"
                          : "border-[#d8e2d4] bg-[#f7faf4] text-gray-600 hover:border-emerald-400"
                      }`}
                    >
                      {savedAddress.label}
                    </button>
                  );
                })}
              </div>
            )}

            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={3}
              placeholder="Street, apartment, city, ZIP"
              className="mt-4 w-full resize-none rounded-2xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="rounded-3xl border border-[#d8e2d4] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfeadb] text-green-800">
                <FiCreditCard size={19} />
              </span>
              <div>
                <h3 className="font-semibold text-[#15251b]">
                  Payment Method
                </h3>
                <p className="text-sm text-gray-500">Choose how you want to pay.</p>
              </div>
            </div>
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option>Card ending in 4242</option>
              <option>Cash on delivery</option>
              <option>FreshCart wallet</option>
            </select>
          </div>

          <div className="rounded-3xl border border-[#d8e2d4] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfeadb] text-green-800">
                <FiCalendar size={19} />
              </span>
              <div>
                <h3 className="font-semibold text-[#15251b]">
                  Schedule Delivery
                </h3>
                <p className="text-sm text-gray-500">Pick a day and delivery window.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <input
                type="date"
                value={deliveryDate}
                min={minDeliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                className="rounded-2xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
              <select
                value={deliveryTime}
                onChange={(event) => setDeliveryTime(event.target.value)}
                className="rounded-2xl border border-[#d8e2d4] bg-[#f7faf4] px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                <option value="09:00-11:00">9:00 AM - 11:00 AM</option>
                <option value="12:00-14:00">12:00 PM - 2:00 PM</option>
                <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-[#d8e2d4] bg-[#f7faf4] p-5">
            {[
              { icon: FiTruck, text: "Cold-packed fresh delivery" },
              { icon: FiShield, text: "Quality checked before dispatch" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dfeadb] text-green-800">
                    <Icon size={16} />
                  </span>
                  <p className="text-sm font-medium text-gray-700">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </div>
    </ProtectedRoute>
  );
}
