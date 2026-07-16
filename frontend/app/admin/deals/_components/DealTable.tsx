"use client";

import Image from "next/image";
import { FiEdit2, FiGift, FiTrash2 } from "react-icons/fi";
import { Deal } from "../../../../lib/api/deals";
import { resolveImageUrl } from "../../../../lib/resolveImageUrl";

export default function DealTable({
  deals,
  loading,
  onEdit,
  onDelete,
}: {
  deals: Deal[];
  loading: boolean;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <FiGift size={22} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-950">No deals found</h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <FiGift size={18} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-950">Deals</h2>
          <p className="text-xs font-semibold text-slate-500">{deals.length} deals</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Deal</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Discount</th>
              <th className="px-5 py-3">Badge</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deals.map((deal) => (
              <tr key={deal.id} className="text-sm transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {(deal.image || deal.product?.image) && (
                        <Image
                          src={resolveImageUrl(deal.image || deal.product?.image)}
                          alt={deal.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <p className="font-semibold text-slate-950">{deal.title}</p>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">
                  {deal.product?.name || "—"}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {deal.discountPercentage}%
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">{deal.badge}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      deal.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {deal.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(deal)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.96]"
                      aria-label={`Edit ${deal.title}`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(deal)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.96]"
                      aria-label={`Delete ${deal.title}`}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
