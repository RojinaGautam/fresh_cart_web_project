"use client";

import Image from "next/image";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { PiStorefrontBold } from "react-icons/pi";

const categories = [
  {
    title: "Fresh Fruits",
    subtitle: "Seasonal Picks & Berries",
    image: "/fruitsberries-hd.png",
    className: "md:col-span-1",
  },
  {
    title: "Vegetables",
    subtitle: "Organic & Locally Grown",
    image: "/vegetables1-hd.png",
    className: "md:col-span-1",
  },
];

const sideCategories = [
  { title: "Dairy", subtitle: "Milk & Cheese", image: "/bottles-hd.png" },
  { title: "Bakery", subtitle: "Baked Fresh Daily", image: "" },
];

const products = [
  {
    name: "Organic Hass Avocado",
    category: "Avocado",
    price: "$2.40",
    unit: "/pc",
    image: "/avocado-hd.png",
  },
  {
    name: "Organic Raspberries",
    category: "Local Farm Harvest",
    price: "$4.80",
    unit: "/pt",
    image: "/raspberries-product-hd.png",
  },
  {
    name: "Curly Kale Bunch",
    category: "Fresh Leafy Greens",
    price: "$3.25",
    unit: "/ea",
    image: "/leafygreens-hd.png",
  },
  {
    name: "Premium Bananas",
    category: "Tropical Goodness",
    price: "$0.89",
    unit: "/lb",
    image: "/banana-hd.png",
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
                <button className="rounded-md bg-[#079b3b] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#087f35]">
                  Shop Now
                </button>
                <button className="rounded-md bg-white px-5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-50">
                  View Offers
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#15251b]">
                Browse by Category
              </h2>
              <p className="mt-1 text-[11px] font-normal text-gray-500">
                Find exactly what you need for your next meal.
              </p>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-bold text-green-700">
              View all categories
              <FiArrowRight size={14} />
            </button>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.2fr_180px]">
            {categories.map((category) => (
              <article
                key={category.title}
                className={`relative min-h-[235px] overflow-hidden rounded-md bg-gray-900 ${category.className}`}
              >
                <Image
                  src={category.image}
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
                    {category.subtitle}
                  </p>
                </div>
              </article>
            ))}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {sideCategories.map((category) => (
                <article
                  key={category.title}
                  className={
                    category.image
                      ? "relative min-h-[111px] overflow-hidden rounded-md bg-white"
                      : "flex min-h-[111px] flex-col items-center justify-center rounded-md border border-gray-100 bg-white p-3 text-center"
                  }
                >
                  {category.image ? (
                    <>
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        quality={90}
                        sizes="180px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-left text-white">
                        <h3 className="text-sm font-bold">{category.title}</h3>
                        <p className="text-[10px] text-white/80">
                          {category.subtitle}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700">
                        <PiStorefrontBold size={18} />
                      </span>
                      <h3 className="text-sm font-bold text-[#15251b]">
                        {category.title}
                      </h3>
                      <p className="text-[10px] font-normal text-gray-500">
                        {category.subtitle}
                      </p>
                    </>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#15251b]">
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
                className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
              >
                <div className="relative h-32 w-full overflow-hidden bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    quality={90}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain"
                  />
                  <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                    <FiStar size={13} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-[#15251b]">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-normal text-gray-500">
                    {product.category}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-green-700">
                      {product.price}
                      <span className="text-[11px] font-semibold text-gray-400">
                        {product.unit}
                      </span>
                    </p>
                    <span className="text-[9px] font-normal text-gray-400">
                      4.9 (128 reviews)
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
