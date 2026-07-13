import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { getQuickDealPage, quickDealPages } from "../deal-pages";

export function generateStaticParams() {
  return quickDealPages.map((deal) => ({ slug: deal.slug }));
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deal = getQuickDealPage(slug);

  if (!deal) {
    notFound();
  }

  const Icon = deal.icon;

  return (
    <div className="space-y-7">
      <section className="rounded-[28px] border border-[#d8e2d4] bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 rounded-full bg-[#dfeadb] px-4 py-2 text-xs font-bold text-green-800 transition hover:bg-[#d3e2cf]"
        >
          <FiArrowLeft size={14} />
          Back to deals
        </Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[80px_1fr_auto] lg:items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Icon size={26} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              {deal.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#15251b]">
              {deal.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              {deal.description}
            </p>
          </div>
          <Link
            href={deal.href}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2d1b]"
          >
            {deal.cta}
            <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-[#d8e2d4] bg-[#f7faf4] p-6">
        <h2 className="text-xl font-semibold text-[#15251b]">
          What this offer includes
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["FreshCart pricing", "Fast shopping flow", "Easy weekly restock"].map(
            (item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#d8e2d4] bg-white p-4 text-sm font-semibold text-gray-700"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
