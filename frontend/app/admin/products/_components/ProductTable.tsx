"use client";

import Image from "next/image";
import {
  FiBox,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { AdminMeta } from "../../../../lib/api/admin/product";
import { Product } from "../../../../lib/api/products";
import { resolveImageUrl } from "../../../../lib/resolveImageUrl";

export default function ProductTable({
  products,
  meta,
  limit,
  loading,
  pageLabel,
  onLimitChange,
  onEdit,
  onDelete,
  onPrevious,
  onNext,
}: {
  products: Product[];
  meta: AdminMeta;
  limit: number;
  loading: boolean;
  pageLabel: string;
  onLimitChange: (limit: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <FiBox size={22} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-950">
          No products found
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Try another search or create a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FiBox size={18} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Products</h2>
            <p className="text-xs font-semibold text-slate-500">{pageLabel}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="text-sm transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <Image src={resolveImageUrl(product.image)} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">
                  {product.category?.title || "—"}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  ${product.price.toFixed(2)}
                  {product.oldPrice && (
                    <span className="ml-2 text-xs text-slate-400 line-through">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">{product.stock}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {product.isFeatured && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        Featured
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        product.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.96]"
                      aria-label={`Edit ${product.name}`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.96]"
                      aria-label={`Delete ${product.name}`}
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

      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs font-bold text-slate-500">
          Page {meta.page} of {Math.max(meta.totalPages, 1)}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            Rows per page
            <select
              value={limit}
              onChange={(event) => onLimitChange(Number(event.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50"
            >
              {[5, 10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={meta.page <= 1 || loading}
              onClick={onPrevious}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft size={14} />
              Previous
            </button>
            <button
              type="button"
              disabled={meta.page >= meta.totalPages || loading}
              onClick={onNext}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
