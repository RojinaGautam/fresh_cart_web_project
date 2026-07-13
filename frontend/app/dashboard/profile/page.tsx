"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiChevronRight,
  FiEdit2,
  FiGift,
  FiHeart,
  FiHome,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { Avatar } from "@/app/_components/AccountShell";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { Order } from "@/lib/api/orders";
import { getOrdersAction } from "@/lib/actions/orders-action";

const formatDate = (date?: string) => {
  if (!date) return "March 12, 1994";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusTone = (status: string) => {
  if (status === "delivered") return "bg-emerald-50 text-emerald-700";
  if (status === "processing" || status === "out_for_delivery")
    return "bg-sky-50 text-sky-700";
  if (status === "cancelled") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
};

const coupons = [
  { code: "FRESH20", text: "20% off seasonal fruit boxes", expires: "Expires Jul 30" },
  { code: "GREEN10", text: "$10 off orders above $60", expires: "Expires Aug 12" },
];

type SavedAddress = {
  id: string;
  label: string;
  street: string;
  city: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "home",
      label: "Home",
      street: "123 Highland Terrace, Apt 4B",
      city: "Portland, OR 97202",
    },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState("");
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
  });

  useEffect(() => {
    void (async () => {
      const response = await getOrdersAction({ limit: 10 });
      if (response.success) {
        setOrders(response.data as Order[]);
        setOrdersTotal(response.meta?.total ?? response.data.length);
      }
    })();
  }, []);

  const savedItems = (wishlist?.items || []).slice(0, 3);

  const pendingDeliveries = orders.filter((order) =>
    ["pending", "processing", "out_for_delivery"].includes(order.status),
  ).length;

  const stats = [
    { label: "Total Orders", value: String(ordersTotal), icon: FiPackage, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Saved Items", value: String(wishlist?.items.length || 0), icon: FiHeart, tone: "bg-rose-50 text-rose-600" },
    { label: "Active Deals", value: "4", icon: FiGift, tone: "bg-amber-50 text-amber-600" },
    { label: "Pending Deliveries", value: String(pendingDeliveries), icon: FiTruck, tone: "bg-sky-50 text-sky-600" },
  ];

  if (!user) return null;

  const closeAddressForm = () => {
    setAddressForm({ label: "", street: "", city: "" });
    setEditingAddressId("");
    setShowAddressForm(false);
  };

  const handleOpenAddAddress = () => {
    setAddressForm({ label: "", street: "", city: "" });
    setEditingAddressId("");
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: SavedAddress) => {
    setAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((current) => current.filter((address) => address.id !== id));

    if (editingAddressId === id) {
      closeAddressForm();
    }
  };

  const handleSaveAddress = () => {
    if (!addressForm.label.trim() || !addressForm.street.trim() || !addressForm.city.trim()) {
      return;
    }

    if (editingAddressId) {
      setAddresses((current) =>
        current.map((address) =>
          address.id === editingAddressId
            ? {
                ...address,
                label: addressForm.label.trim(),
                street: addressForm.street.trim(),
                city: addressForm.city.trim(),
              }
            : address,
        ),
      );
      closeAddressForm();
      return;
    }

    setAddresses((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        label: addressForm.label.trim(),
        street: addressForm.street.trim(),
        city: addressForm.city.trim(),
      },
    ]);
    closeAddressForm();
  };

  return (
    <div className="space-y-6">
      <section
        id="profile"
        className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
      >
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-800 to-green-600 px-6 py-8 text-white sm:px-8">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/vegetables1-hd.png"
              alt="FreshCart profile banner"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="relative h-28 w-28 shrink-0">
                <Avatar
                  user={user}
                  className="h-28 w-28 text-4xl ring-4 ring-white/80"
                />
                <Link
                  href="/dashboard/profile/edit"
                  aria-label="Edit account"
                  className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg ring-4 ring-emerald-700 transition hover:bg-emerald-50"
                >
                  <FiEdit2 size={18} />
                </Link>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold leading-tight">
                    {user.fullName}
                  </h1>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-700">
                    <FiCheckCircle size={14} />
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-emerald-50">
                  FreshCart customer since {formatDate(user.createdAt)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                    Verified Account
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                    Eco Star Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}>
                  <Icon size={20} />
                </span>
                <p className="mt-4 text-2xl font-semibold text-slate-950">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">
              Profile Information
            </h2>
            <Link
              href="/dashboard/profile/edit"
              className="text-sm font-semibold text-emerald-700"
            >
              Update
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Full Name", user.fullName],
              ["Email Address", user.email],
              ["Phone Number", user.phoneNumber || "Not added"],
              ["Account Role", user.role],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {label}
                </p>
                <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div id="saved-addresses" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">
              Saved Addresses
            </h2>
            <button
              type="button"
              onClick={() => (showAddressForm ? closeAddressForm() : handleOpenAddAddress())}
              className="text-sm font-semibold text-emerald-700"
            >
              {showAddressForm ? "Close" : "Add address"}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
              >
                <div className="flex gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <FiHome size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-950">{address.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {address.street}
                      <br />
                      {address.city}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-start gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditAddress(address)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm transition hover:bg-emerald-100"
                      aria-label={`Edit ${address.label} address`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50"
                      aria-label={`Delete ${address.label} address`}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAddressForm && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  value={addressForm.label}
                  onChange={(event) =>
                    setAddressForm((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  placeholder="Label"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  value={addressForm.street}
                  onChange={(event) =>
                    setAddressForm((current) => ({
                      ...current,
                      street: event.target.value,
                    }))
                  }
                  placeholder="Street / apartment"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
                <input
                  value={addressForm.city}
                  onChange={(event) =>
                    setAddressForm((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                  placeholder="City, state, ZIP"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveAddress}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <FiPlus size={16} />
                {editingAddressId ? "Save Address Changes" : "Save Address"}
              </button>
            </div>
          )}

          {!showAddressForm && (
            <button
              type="button"
              onClick={handleOpenAddAddress}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <FiPlus size={16} />
              Add New Address
            </button>
          )}
        </div>
      </section>

      <section id="orders" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">My Orders</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest FreshCart orders.
            </p>
          </div>
          <Link
            href="/deals"
            className="hidden items-center gap-2 text-sm font-semibold text-emerald-700 sm:flex"
          >
            Browse deals
            <FiChevronRight size={16} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No orders yet. Place your first order from the cart page.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {orders.map((order) => (
              <article
                key={order.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-50">
                    <Image
                      src={resolveImageUrl(order.items[0]?.image) || "/images/products/fallback-grocery.png"}
                      alt={order.orderNumber}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">Order #{order.orderNumber}</p>
                    <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}
                  >
                    {statusLabel[order.status] || order.status}
                  </span>
                  <p className="text-lg font-semibold text-emerald-700">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div id="saved-items" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">
              Wishlist and Saved Items
            </h2>
            <FiHeart className="text-rose-500" size={20} />
          </div>
          {savedItems.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Save items from any product page to see them here.
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {savedItems.map((item) => (
                <article key={item.product.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="relative h-28">
                    <Image
                      src={resolveImageUrl(item.product.image)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-950">
                    {item.product.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    ${item.product.price.toFixed(2)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div id="coupons" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">
              Deals and Coupons
            </h2>
            <FiGift className="text-emerald-700" size={20} />
          </div>
          <div className="mt-5 space-y-3">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-emerald-800">
                    {coupon.code}
                  </p>
                  <button className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
                    Copy
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-600">{coupon.text}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {coupon.expires}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <FiShoppingBag className="mx-auto text-emerald-700" size={28} />
        <h2 className="mt-3 text-xl font-semibold text-slate-950">
          Ready for your next fresh order?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Explore deals and seasonal picks, then check out from your cart.
        </p>
        <Link
          href="/deals"
          className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Explore deals
        </Link>
      </section>
    </div>
  );
}
