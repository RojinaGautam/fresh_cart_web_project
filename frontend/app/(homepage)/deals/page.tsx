"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiGift,
  FiHeart,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";
import { Deal } from "@/lib/api/deals";
import { getDealsAction } from "@/lib/actions/deals-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { FALLBACK_PRODUCT_IMAGE, resolveImageUrl } from "@/lib/resolveImageUrl";
import { quickDealPages } from "./deal-pages";

export default function DealsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem: addCartItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealMessage, setDealMessage] = useState("");
  const [savedDeal, setSavedDeal] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await getDealsAction();
      if (response.success) {
        setDeals(response.data as Deal[]);
      }
    })();
  }, []);

  const requireLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent("/deals")}`);
  };

  const handleAddDeal = async (deal: Deal) => {
    if (!deal.product) return;

    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    const success = await addCartItem(deal.product.id);
    setDealMessage(
      success
        ? `${deal.title} added to your cart.`
        : `Unable to add ${deal.title} to cart.`,
    );
  };

  const handleSaveDeal = async (deal: Deal) => {
    if (!deal.product) return;

    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    const success = await addWishlistItem(deal.product.id);
    setSavedDeal(
      success
        ? `${deal.title} saved for later.`
        : `Unable to save ${deal.title}.`,
    );
  };

  return (
    <div className="space-y-9">
      <section className="relative overflow-hidden rounded-md bg-[#d9e4d7]">
        <div className="relative min-h-[300px] px-7 py-9 sm:px-10">
          <Image
            src="/images/deals/grocery-aisle-hero.png"
            alt="Fresh grocery aisle deals"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-white/5" />
          <div className="relative max-w-xl">
            <Link
              href="#today"
              className="inline-flex items-center gap-2 rounded-full bg-[#079b3b] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#087f35]"
            >
              <FiGift size={13} />
              Weekly FreshCart Deals
            </Link>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#15251b] sm:text-4xl">
              Fresh Savings for Your{" "}
              <span className="text-green-600">Everyday Cart.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm font-normal leading-6 text-gray-600">
              Shop curated grocery deals with clean bundles, soft discounts,
              and fast FreshCart delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#today"
                className="rounded-md bg-[#079b3b] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#087f35]"
              >
                Shop best deals
              </Link>
              <Link
                href="/support"
                className="rounded-md bg-white px-5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-50"
              >
                Need help?
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="today" className="scroll-mt-24">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#15251b]">
              Today&apos;s Best Deals
            </h2>
            <p className="mt-1 text-[11px] font-normal text-gray-500">
              Clear bundle offers selected for regular FreshCart shopping.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-[#dfeadb] px-4 py-2 text-xs font-bold text-green-800 transition hover:bg-[#d3e2cf]"
          >
            View cart
            <FiArrowRight size={14} />
          </Link>
        </div>

        {(dealMessage || savedDeal) && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {dealMessage && (
              <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                {dealMessage}
              </p>
            )}
            {savedDeal && (
              <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {savedDeal}
              </p>
            )}
          </div>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {deals.map((deal) => (
            <article
              key={deal.id}
              className="group overflow-hidden rounded-2xl border border-[#d8e2d4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-56 overflow-hidden bg-white">
                <Image
                  src={resolveImageUrl(deal.image || deal.product?.image) || FALLBACK_PRODUCT_IMAGE}
                  alt={deal.title}
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-green-800 shadow-sm">
                  {deal.badge}
                </span>
                <button
                  type="button"
                  aria-label={`Save ${deal.title}`}
                  onClick={() => handleSaveDeal(deal)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm transition hover:bg-rose-50"
                >
                  <FiHeart size={15} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-[#15251b]">
                  {deal.title}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">
                  {deal.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-green-700">
                      ${deal.product?.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddDeal(deal)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#173822] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0f2d1b]"
                  >
                    <FiShoppingCart size={14} />
                    Add deal
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="limited" className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div
          className="relative min-h-[260px] overflow-hidden rounded-2xl border border-[#d8e2d4] bg-[#f7faf4] p-6"
        >
          <Image
            src="/images/deals/grocery-aisle-hero.png"
            alt="Fresh grocery limited offers"
            fill
            quality={95}
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf4] via-[#f7faf4]/90 to-[#f7faf4]/55" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
            <FiClock size={22} />
          </span>
          <h2 className="relative mt-4 text-2xl font-semibold text-[#15251b]">
            Limited Time Offers
          </h2>
          <p className="relative mt-3 max-w-lg text-sm leading-6 text-gray-600">
            Flash savings on snack boxes, organic produce, and daily care
            essentials. Offers refresh every morning.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {quickDealPages.map((deal) => {
            const Icon = deal.icon;

            return (
              <Link
                key={deal.title}
                href={`/deals/${deal.slug}`}
                className="rounded-2xl border border-[#d8e2d4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={17} />
                </span>
                <h3 className="mt-3 font-semibold text-[#15251b]">
                  {deal.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {deal.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-[#d8e2d4] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="#today" className="flex w-fit gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((item) => (
                <FiStar key={item} fill="currentColor" />
              ))}
            </Link>
            <h2 className="mt-3 text-2xl font-semibold text-[#15251b]">
              FreshCart deals are ready
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Browse deals, add them to your cart, then continue shopping from
              the dashboard.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d1b]"
          >
            Go to dashboard
            <FiArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
