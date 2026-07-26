"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiMinus,
  FiGrid,
  FiHeart,
  FiPlus,
  FiSearch,
  FiShoppingCart,
  FiStar,
  FiX,
} from "react-icons/fi";
import { Category } from "@/lib/api/categories";
import { Product } from "@/lib/api/products";
import { getProductsAction } from "@/lib/actions/products-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

const sortOptions = ["Recommended", "Popular", "Newest"] as const;

const sortParamFor = (sort: (typeof sortOptions)[number]) => {
  if (sort === "Popular") return "popular";
  if (sort === "Newest") return "newest";
  return undefined;
};

const formatUnit = (unit?: string) => {
  const cleanUnit = unit?.replace("/", "").trim();
  return cleanUnit || "item";
};

export default function CategoryBrowsePage({
  category,
  otherCategories,
  initialSearch = "",
  browseAllProducts = false,
}: {
  category: Category;
  otherCategories: Category[];
  initialSearch?: string;
  browseAllProducts?: boolean;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addItem: addCartItem } = useCart();
  const { addItem: addWishlistItem } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState<(typeof sortOptions)[number]>(
    "Recommended",
  );
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const response = await getProductsAction({
      category: browseAllProducts ? undefined : category.slug,
      search: searchTerm || undefined,
      sort: sortParamFor(activeSort),
      limit: 60,
    });

    if (response.success) {
      setProducts(response.data as Product[]);
    }

    setLoading(false);
  }, [category.slug, browseAllProducts, searchTerm, activeSort]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchProducts();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [fetchProducts]);

  const requireLogin = () => {
    const redirectPath = browseAllProducts
      ? `/categories${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`
      : `/categories/${category.slug}`;
    router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const handleSaveProduct = async (product: Product) => {
    if (!isAuthenticated) {
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
    if (!isAuthenticated) {
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

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailQuantity(1);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    setDetailQuantity(1);
  };

  const handleAddDetailCart = async () => {
    if (!selectedProduct) return;

    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    const success = await addCartItem(selectedProduct.id, detailQuantity);
    setCartMessage(
      success
        ? `${detailQuantity} ${selectedProduct.name} added to your cart.`
        : `Unable to add ${selectedProduct.name} to cart.`,
    );

    if (success) {
      closeProductDetails();
    }
  };

  const filteredCategories = useMemo(() => {
    const query = categorySearchTerm.trim().toLowerCase();

    return otherCategories
      .filter((item) => browseAllProducts || item.slug !== category.slug)
      .filter((item) => {
        if (!query) return true;

        return (
          item.title.toLowerCase().includes(query) ||
          item.slug.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      });
  }, [browseAllProducts, category.slug, categorySearchTerm, otherCategories]);

  const pageTitle = browseAllProducts ? "FreshCart Products" : category.title;
  const pageDescription = browseAllProducts
    ? "Search fresh produce, bakery, dairy, household, and everyday grocery picks."
    : category.description;
  const selectedUnit = selectedProduct ? formatUnit(selectedProduct.unit) : "item";

  return (
    <>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[28px] bg-[#123821] px-6 py-10 text-white shadow-sm sm:px-10 lg:px-12">
          <Image
            src={resolveImageUrl(category.image)}
            alt={category.title}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e2c1a]/95 via-[#0e2c1a]/70 to-[#0e2c1a]/20" />
          <div className="relative max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-semibold text-emerald-50 ring-1 ring-white/15 transition hover:bg-white/20"
            >
              <FiArrowLeft size={15} />
              Back to categories
            </Link>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              {browseAllProducts ? "FreshCart Search" : "FreshCart Category"}
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">
              {pageTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50/90 sm:text-base">
              {pageDescription}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d8e2d4] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#15251b]">
                {browseAllProducts ? "Search Results" : `${category.title} Products`}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {browseAllProducts
                  ? "Search across every FreshCart grocery department."
                  : `Showing only products from ${category.title}.`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-full bg-[#eef2ea] px-4 py-3 text-sm text-slate-600 sm:min-w-[260px]">
                <FiSearch size={16} />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={
                    browseAllProducts
                      ? "Search any product..."
                      : `Search ${category.title.toLowerCase()}...`
                  }
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {sortOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveSort(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeSort === item
                    ? "bg-[#173822] text-white"
                    : "bg-[#eef2ea] text-slate-600 hover:bg-[#dfeadb]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {savedMessage && (
            <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {savedMessage}
            </p>
          )}
          {cartMessage && (
            <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {cartMessage}
            </p>
          )}

          {!loading && products.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-[#d8e2d4] bg-[#f7faf4] px-6 py-12 text-center">
              <FiGrid className="mx-auto text-emerald-700" size={30} />
              <h3 className="mt-3 text-lg font-semibold text-[#15251b]">
                No products found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another search inside {category.title}.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  onClick={() => openProductDetails(product)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-transparent transition hover:-translate-y-1 hover:shadow-lg hover:ring-emerald-100"
                >
                  <div className="relative h-48 overflow-hidden bg-[#eef2ea]">
                    <Image
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      fill
                      quality={95}
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {product.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-green-800 shadow-sm">
                        {product.tag}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleSaveProduct(product);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-rose-500"
                      aria-label={`Save ${product.name}`}
                    >
                      <FiHeart size={15} />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-medium text-slate-400">
                      {product.category?.title || category.title}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-[#15251b]">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar key={star} size={12} fill="currentColor" />
                      ))}
                      <span className="ml-1 text-[11px] text-slate-400">
                        {product.rating}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-green-800">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleAddCart(product);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d9f43] text-white shadow-sm transition hover:bg-[#087a35]"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <FiShoppingCart size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[#d8e2d4] bg-[#f7faf4] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#15251b]">
                Browse categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Jump between FreshCart grocery departments.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:min-w-[260px]">
              <FiSearch size={16} />
              <input
                value={categorySearchTerm}
                onChange={(event) => setCategorySearchTerm(event.target.value)}
                placeholder="Search category..."
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCategories.slice(0, 8).map((item) => (
              <Link
                key={item.slug}
                href={`/categories/${item.slug}`}
                className="group relative min-h-36 overflow-hidden rounded-2xl bg-slate-900"
              >
                <Image
                  src={resolveImageUrl(item.image)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-semibold">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-[#d8e2d4] bg-white px-5 py-8 text-center text-sm text-slate-500">
              No categories match your search.
            </div>
          )}
        </section>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07180d]/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProduct.name} details`}
          onClick={closeProductDetails}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-[#d8e2d4] bg-[#f8fbf5] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[320px] overflow-hidden rounded-t-[28px] bg-[#e7eee3] lg:min-h-[560px] lg:rounded-l-[28px] lg:rounded-tr-none">
                <Image
                  src={resolveImageUrl(selectedProduct.image)}
                  alt={selectedProduct.name}
                  fill
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
                {selectedProduct.tag && (
                  <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-green-800 shadow-sm">
                    {selectedProduct.tag}
                  </span>
                )}
              </div>

              <div className="relative p-6 sm:p-8">
                <button
                  type="button"
                  onClick={closeProductDetails}
                  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8e2d4] bg-white text-slate-500 transition hover:text-[#123821]"
                  aria-label="Close product details"
                >
                  <FiX size={18} />
                </button>

                <p className="pr-12 text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                  {selectedProduct.category?.title || category.title}
                </p>
                <h2 className="mt-3 pr-10 text-3xl font-semibold leading-tight text-[#112318] sm:text-4xl">
                  {selectedProduct.name}
                </h2>

                <div className="mt-4 flex items-center gap-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} size={15} fill="currentColor" />
                  ))}
                  <span className="text-sm font-medium text-slate-500">
                    {selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)
                  </span>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  {selectedProduct.description ||
                    "A fresh FreshCart grocery pick selected for easy weekly shopping, fast basket building, and reliable home delivery."}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Stock", `${selectedProduct.stock} available`],
                    ["Unit", selectedUnit],
                    ["FreshCart", selectedProduct.isFeatured ? "Featured pick" : "Market pick"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#d8e2d4] bg-white px-4 py-3"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#15251b]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-3xl border border-[#d8e2d4] bg-white p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-green-800">
                        ${selectedProduct.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-full bg-[#eef2ea] p-1">
                      <button
                        type="button"
                        onClick={() =>
                          setDetailQuantity((quantity) => Math.max(1, quantity - 1))
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#123821] shadow-sm transition hover:bg-[#dfeadb]"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="min-w-14 text-center text-base font-semibold text-[#15251b]">
                        {detailQuantity} {selectedUnit}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDetailQuantity((quantity) =>
                            Math.min(selectedProduct.stock || 99, quantity + 1),
                          )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#123821] text-white shadow-sm transition hover:bg-[#0d2a19]"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleAddDetailCart}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0d9f43] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#087a35]"
                    >
                      <FiShoppingCart size={17} />
                      Add {detailQuantity} {selectedUnit} to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSaveProduct(selectedProduct)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e2d4] bg-[#f8fbf5] px-5 py-3 text-sm font-semibold text-[#123821] transition hover:bg-[#eef2ea]"
                    >
                      <FiHeart size={17} />
                      Save item
                    </button>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Total for {detailQuantity} {selectedUnit}: $
                    {(selectedProduct.price * detailQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
