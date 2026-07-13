"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiShoppingCart,
  FiX,
  FiShield,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { PiStorefrontBold } from "react-icons/pi";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { Category } from "@/lib/api/categories";
import { Product } from "@/lib/api/products";
import { getCategoriesAction } from "@/lib/actions/categories-action";
import { getProductsAction } from "@/lib/actions/products-action";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

const trendingPageSize = 4;

const featureCards = [
  {
    icon: FiShield,
    title: "100% Organic",
    text: "We partner exclusively with certified organic farmers who respect the earth.",
  },
  {
    icon: FiTruck,
    title: "Fast Delivery",
    text: "From harvest to home in under 24 hours. Guaranteed freshness in every box.",
  },
  {
    icon: FiStar,
    title: "Ethically Sourced",
    text: "Fair wages for farmers and sustainable packaging for a healthier planet.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { addItem: addCartItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [trendingStartIndex, setTrendingStartIndex] = useState(0);
  const [savedMessage, setSavedMessage] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const [categoriesResponse, productsResponse] = await Promise.all([
        getCategoriesAction(),
        getProductsAction({ featured: true, limit: 20 }),
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data as Category[]);
      }

      if (productsResponse.success) {
        setProducts(productsResponse.data as Product[]);
      }
    })();
  }, []);

  const heroCategories = categories.slice(0, 2);
  const sideCategories = categories.slice(2, 4);

  const visibleProducts = products.slice(
    trendingStartIndex,
    trendingStartIndex + trendingPageSize,
  );

  const showPreviousProduct = () => {
    setTrendingStartIndex((current) => {
      if (current === 0) {
        return Math.floor((products.length - 1) / trendingPageSize) * trendingPageSize;
      }

      return Math.max(current - trendingPageSize, 0);
    });
  };

  const showNextProduct = () => {
    setTrendingStartIndex((current) =>
      current + trendingPageSize >= products.length ? 0 : current + trendingPageSize,
    );
  };

  const handleBrowseCategory = (slug: string) => {
    router.push(`/categories/${slug}`);
  };

  const requireLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent("/dashboard")}`);
  };

  const handleSaveProduct = async (product: Product) => {
    if (!loading && !isAuthenticated) {
      requireLogin();
      return;
    }

    const success = await addWishlistItem(product.id);
    setSavedMessage(
      success
        ? `${product.name} saved to your wishlist.`
        : `Unable to save ${product.name}.`,
    );
  };

  const handleAddCart = async (product: Product) => {
    if (!loading && !isAuthenticated) {
      requireLogin();
      return;
    }

    const success = await addCartItem(product.id);
    setCartMessage(
      success
        ? `${product.name} added to your cart.`
        : `Unable to add ${product.name} to cart.`,
    );
  };

  return (
    <>
        <section className="overflow-hidden rounded-md bg-[#d9e4d7]">
          <div className="relative min-h-[260px] px-7 py-8 sm:px-10 sm:py-9">
            <Image
              src="/vegetable-hd.png"
              alt="Fresh vegetables in a wooden crate"
              fill
              priority
              quality={95}
              sizes="(max-width: 768px) 100vw, 1500px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/25 to-transparent" />
            <div className="relative max-w-md">
              <span className="rounded-full bg-[#079b3b] px-4 py-1 text-[10px] font-bold uppercase text-white">
                Farm to table
              </span>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-[#15251b] sm:text-4xl">
                Freshness at Your{" "}
                <span className="text-green-600">Doorstep.</span>
              </h1>
              <p className="mt-3 max-w-sm text-xs font-normal leading-5 text-gray-600 sm:text-sm">
                Sustainable, ethically-sourced groceries from local farmers,
                delivered to your kitchen within 24 hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#browse-category"
                  className="rounded-md bg-[#079b3b] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#087f35]"
                >
                  Shop Now
                </Link>
                <Link
                  href="/deals"
                  className="rounded-md bg-white px-5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-50"
                >
                  View Offers
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="browse-category" className="mt-7 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#15251b]">
                Browse by Category
              </h2>
              <p className="mt-1 text-[11px] font-normal text-gray-500">
                Find exactly what you need for your next meal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAllCategories((value) => !value)}
              className="flex items-center gap-1 rounded-full bg-[#dfeadb] px-3 py-2 text-[11px] font-bold text-green-800 transition hover:bg-[#d3e2cf]"
            >
              {showAllCategories ? "Hide categories" : "View all categories"}
              {showAllCategories ? <FiX size={14} /> : <FiArrowRight size={14} />}
            </button>
          </div>

          {!showAllCategories && (
            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.2fr_180px]">
              {heroCategories.map((category) => (
                <article
                  key={category.id}
                  className="relative min-h-[235px] overflow-hidden rounded-md bg-gray-900"
                >
                  <Image
                    src={resolveImageUrl(category.image)}
                    alt={category.title}
                    fill
                    quality={95}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <h3 className="text-base font-bold">{category.title}</h3>
                    <p className="text-[11px] font-normal text-white/75">
                      {category.description}
                    </p>
                  </div>
                </article>
              ))}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {sideCategories.map((category) => (
                  <article
                    key={category.id}
                    className="relative min-h-[111px] overflow-hidden rounded-md bg-white"
                  >
                    <Image
                      src={resolveImageUrl(category.image)}
                      alt={category.title}
                      fill
                      quality={90}
                      sizes="180px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-left text-white">
                      <h3 className="text-sm font-bold">{category.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {showAllCategories && (
            <div className="mt-5 rounded-3xl border border-[#d8e2d4] bg-[#f7faf4] p-4 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#15251b]">
                    All FreshCart Categories
                  </h3>
                  <p className="text-xs text-gray-500">
                    Choose from fresh produce, dairy, bakery, and everyday market picks.
                  </p>
                </div>
                <span className="text-xs font-semibold text-green-800">
                  {categories.length} categories
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                  <article
                    key={category.id}
                    className="group overflow-hidden rounded-2xl border border-[#d8e2d4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-40 overflow-hidden bg-[#eef2ea]">
                      {category.image ? (
                        <Image
                          src={resolveImageUrl(category.image)}
                          alt={category.title}
                          fill
                          quality={95}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dfeadb] text-green-800">
                            <PiStorefrontBold size={28} />
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                      <h4 className="absolute bottom-3 left-4 right-4 text-base font-semibold text-white">
                        {category.title}
                      </h4>
                    </div>
                    <div className="p-4">
                      <p className="text-sm leading-5 text-gray-600">
                        {category.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleBrowseCategory(category.slug)}
                        className="mt-4 inline-flex rounded-full bg-[#173822] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0f2d1b]"
                      >
                        Browse category
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#15251b]">
              Trending Now
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Show previous trending product"
                onClick={showPreviousProduct}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-white hover:text-green-800"
              >
                <FiChevronLeft size={15} />
              </button>
              <button
                type="button"
                aria-label="Show next trending product"
                onClick={showNextProduct}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-green-200 hover:bg-white hover:text-green-800"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>

          {savedMessage && (
            <p className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {savedMessage}
            </p>
          )}
          {cartMessage && (
            <p className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {cartMessage}
            </p>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#eef2ea]">
                  <Image
                    src={resolveImageUrl(product.image)}
                    alt={product.name}
                    fill
                    quality={90}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <button
                    type="button"
                    onClick={() => handleSaveProduct(product)}
                    aria-label={`Save ${product.name}`}
                    title="Save item"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-rose-500"
                  >
                    <FiHeart size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                    title="Add to cart"
                    className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0d9f43] text-white shadow-sm transition hover:bg-[#087a35]"
                  >
                    <FiShoppingCart size={15} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-[#15251b]">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-normal text-gray-500">
                    {product.category?.title}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-green-700">
                      ${product.price.toFixed(2)}
                      <span className="text-[11px] font-semibold text-gray-400">
                        {product.unit}
                      </span>
                    </p>
                    <span className="text-[9px] font-normal text-gray-400">
                      {product.rating} ({product.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-9 grid gap-6 border-t border-gray-100 py-9 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={20} />
                </span>
                <h3 className="mt-3 text-base font-semibold text-[#15251b]">
                  {feature.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-[11px] font-normal leading-5 text-gray-500">
                  {feature.text}
                </p>
              </article>
            );
          })}
        </section>
    </>
  );
}
