"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import { formatNPR } from "@/lib/currency";

export default function WishlistPage() {
  const { wishlist, loading, removeItem } = useWishlist();
  const { addItem: addCartItem } = useCart();
  const [cartMessage, setCartMessage] = useState("");

  const items = wishlist?.items || [];

  const handleAddCart = async (productId: string, productName: string) => {
    const success = await addCartItem(productId);
    setCartMessage(
      success
        ? `${productName} added to your cart.`
        : `Unable to add ${productName} to cart.`,
    );
  };

  return (
    <ProtectedRoute>
    <div className="space-y-7">
      <section className="rounded-[28px] border border-[#d8e2d4] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              FreshCart Wishlist
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#15251b]">
              Saved Items
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Products you save with the heart icon appear here for quick access.
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <FiHeart size={22} />
          </span>
        </div>
      </section>

      {cartMessage && (
        <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {cartMessage}
        </p>
      )}

      {!loading && items.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-[#d8e2d4] bg-[#f7faf4] px-6 py-14 text-center">
          <FiHeart className="mx-auto text-rose-400" size={34} />
          <h2 className="mt-4 text-xl font-semibold text-[#15251b]">
            No saved items yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Tap the heart icon on products in Trending Now or category pages to
            save them here.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-[#173822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d1b]"
          >
            Browse products
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.product.id}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden bg-[#eef2ea]">
                <Image
                  src={resolveImageUrl(item.product.image)}
                  alt={item.product.name}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="mt-1 text-base font-semibold text-[#15251b]">
                  {item.product.name}
                </h2>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-emerald-700">
                    {formatNPR(item.product.price)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddCart(item.product.id, item.product.name)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d9f43] text-white shadow-sm transition hover:bg-[#087a35]"
                    >
                      <FiShoppingCart size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
    </ProtectedRoute>
  );
}
