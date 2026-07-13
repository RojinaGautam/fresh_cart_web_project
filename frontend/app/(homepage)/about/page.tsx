import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiHeart,
  FiMapPin,
  FiShield,
  FiTruck,
} from "react-icons/fi";

const values = [
  {
    icon: FiShield,
    title: "Fresh by design",
    text: "Seasonal produce, reliable storage, and grocery handling that keeps quality visible.",
  },
  {
    icon: FiMapPin,
    title: "Local-first sourcing",
    text: "FreshCart highlights nearby growers, market boxes, and trusted weekly suppliers.",
  },
  {
    icon: FiTruck,
    title: "Reliable delivery",
    text: "Delivery is planned around freshness, timing, and simple weekly shopping routines.",
  },
  {
    icon: FiHeart,
    title: "Built for families",
    text: "A calmer grocery flow for households that want good food without extra friction.",
  },
];

const featureImages = [
  {
    title: "Fruit from trusted growers",
    text: "Organic fruit and produce selected from trusted growers and everyday market partners.",
    image: "/images/about/trusted-growers.png",
  },
  {
    title: "Fresh dairy picks",
    text: "Milk, cheese, butter, and dairy essentials chosen for regular FreshCart baskets.",
    image: "/images/about/fresh-dairy-picks.png",
  },
  {
    title: "Daily greens",
    text: "Daily greens and vegetables that help keep every meal simple, fresh, and balanced.",
    image: "/images/about/daily-greens.png",
  },
];

const steps = [
  "Choose fresh picks",
  "Confirm your details",
  "Track your order",
  "Enjoy at home",
];

export default function AboutPage() {
  return (
    <div className="space-y-9">
      <section className="overflow-hidden rounded-md bg-[#d9e4d7]">
        <div className="relative min-h-[360px] px-7 py-9 sm:px-10">
          <Image
            src="/images/about/shopping-aisle-hero.png"
            alt="Customer shopping in a grocery aisle"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent" />
          <div className="relative max-w-xl">
            <span className="rounded-full bg-[#079b3b] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              About FreshCart
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#15251b] sm:text-4xl">
              Groceries Made Fresh,{" "}
              <span className="text-green-600">Simple, and Close.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm font-normal leading-6 text-gray-600">
              FreshCart is built for easy weekly shopping with trusted produce,
              clear grocery picks, and a calm delivery experience.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-md bg-[#079b3b] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#087f35]"
              >
                Start shopping
              </Link>
              <Link
                href="/support"
                className="rounded-md bg-white px-5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-50"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-[#15251b]">
            Why Choose FreshCart
          </h2>
          <p className="mt-1 text-[11px] font-normal text-gray-500">
            A cleaner grocery routine with freshness, support, and reliable
            shopping tools.
          </p>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="rounded-2xl border border-[#d8e2d4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={21} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-[#15251b]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {value.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-[#d8e2d4] bg-[#f7faf4] p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
            <FiCheckCircle size={22} />
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-[#15251b]">
            Our mission
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            Make fresh groceries easier to discover, order, and manage while
            keeping the experience trustworthy, useful, and simple.
          </p>
        </div>
        <div className="rounded-2xl border border-[#d8e2d4] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#15251b]">
            How it works
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step} className="rounded-xl bg-[#eef2ea] p-4">
                <span className="text-xs font-semibold text-emerald-700">
                  Step {index + 1}
                </span>
                <p className="mt-2 font-semibold text-[#15251b]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {featureImages.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-2xl border border-[#d8e2d4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-56 bg-[#eef2ea]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold text-[#15251b]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.text}
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#173822] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0f2d1b]"
              >
                Browse FreshCart
                <FiArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
