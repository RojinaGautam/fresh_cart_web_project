"use client";

import Image from "next/image";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiShoppingCart,
  FiStar,
  FiTruck,
} from "react-icons/fi";

const categories = [
  {
    title: "Fresh Fruits",
    subtitle: "Seasonal Picks & Berries",
    image: "/fruitsberries.png",
    className: "md:col-span-1",
  },
  {
    title: "Vegetables",
    subtitle: "Organic & Locally Grown",
    image: "/vegetables1.png",
    className: "md:col-span-1",
  },
];

const sideCategories = [
  { title: "Dairy", subtitle: "Milk & Cheese", image: "/bottles.png" },
  { title: "Bakery", subtitle: "Baked Fresh Daily", image: "" },
];

const products = [
  {
    name: "Organic Hass Avocado",
    category: "Avocado",
    price: "$2.40",
    unit: "/pc",
    image: "/avocade.png",
  },
  {
    name: "Organic Raspberries",
    category: "Local Farm Harvest",
    price: "$4.80",
    unit: "/pt",
    image: "/raspberries.png",
  },
  {
    name: "Curly Kale Bunch",
    category: "Fresh Leafy Greens",
    price: "$3.25",
    unit: "/ea",
    image: "/leafygreens.png",
  },
  {
    name: "Premium Bananas",
    category: "Tropical Goodness",
    price: "$0.89",
    unit: "/lb",
    image: "/banana.png",
  },
];

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
  return (
    <>
        <section className="overflow-hidden rounded-lg bg-[#d9e4d7]">
          <div className="relative min-h-[300px] px-7 py-10 sm:px-10">
            <Image
              src="/vegetable.png"
              alt="Fresh vegetables in a wooden crate"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
            <div className="relative max-w-md">
              <span className="rounded-full bg-green-600 px-4 py-1 text-[11px] font-black uppercase text-white">
                Farm to table
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-[#142416] sm:text-5xl">
                Freshness at Your{" "}
                <span className="text-green-600">Doorstep.</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-gray-600">
                Sustainable, ethically-sourced groceries from local farmers,
                delivered to your kitchen within 24 hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-md bg-green-600 px-5 py-3 text-xs font-black text-white transition hover:bg-green-700">
                  Shop Now
                </button>
                <button className="rounded-md bg-white px-5 py-3 text-xs font-black text-green-700 transition hover:bg-green-50">
                  View Offers
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#142416]">
                Browse by Category
              </h2>
              <p className="mt-1 text-xs font-medium text-gray-500">
                Find exactly what you need for your next meal.
              </p>
            </div>
            <button className="flex items-center gap-1 text-xs font-black text-green-700">
              View all categories
              <FiArrowRight size={14} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_180px]">
            {categories.map((category) => (
              <article
                key={category.title}
                className={`relative min-h-[260px] overflow-hidden rounded-lg bg-gray-900 ${category.className}`}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-lg font-black">{category.title}</h3>
                  <p className="text-xs font-medium text-white/75">
                    {category.subtitle}
                  </p>
                </div>
              </article>
            ))}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {sideCategories.map((category) => (
                <article
                  key={category.title}
                  className="flex min-h-[122px] flex-col items-center justify-center rounded-lg bg-[#eef4ed] p-4 text-center"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={92}
                      height={70}
                      className="mb-2 object-contain"
                    />
                  ) : (
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <FiShoppingCart size={18} />
                    </span>
                  )}
                  <h3 className="text-sm font-black text-[#142416]">
                    {category.title}
                  </h3>
                  <p className="text-[11px] font-medium text-gray-500">
                    {category.subtitle}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#142416]">
              Trending Now
            </h2>
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                <FiChevronLeft size={15} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500">
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.name}
                className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="relative h-28 overflow-hidden rounded-md bg-[#edf5ec]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-3"
                  />
                  <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                    <FiStar size={13} />
                  </button>
                </div>
                <h3 className="mt-4 text-sm font-black text-[#142416]">
                  {product.name}
                </h3>
                <p className="text-[11px] font-medium text-gray-500">
                  {product.category}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-black text-green-700">
                    {product.price}
                    <span className="text-[11px] font-semibold text-gray-400">
                      {product.unit}
                    </span>
                  </p>
                  <span className="text-[11px] font-semibold text-gray-400">
                    4.9 (128 reviews)
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 border-t border-gray-100 py-10 md:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-lg font-black text-[#142416]">
                  {feature.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-xs font-medium leading-5 text-gray-500">
                  {feature.text}
                </p>
              </article>
            );
          })}
        </section>
    </>
  );
}
