"use client";

import Image from "next/image";
import { FiEdit2, FiGrid, FiTrash2 } from "react-icons/fi";
import { Category } from "../../../../lib/api/categories";
import { resolveImageUrl } from "../../../../lib/resolveImageUrl";

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
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

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <FiGrid size={22} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-950">
          No categories found
        </h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <FiGrid size={18} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-950">Categories</h2>
          <p className="text-xs font-semibold text-slate-500">
            {categories.length} categories
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr key={category.id} className="text-sm transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <Image src={resolveImageUrl(category.image)} alt={category.title} fill className="object-cover" />
                    </div>
                    <p className="font-semibold text-slate-950">{category.title}</p>
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{category.slug}</td>
                <td className="max-w-xs truncate px-5 py-4 font-medium text-slate-600">
                  {category.description}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      category.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.96]"
                      aria-label={`Edit ${category.title}`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.96]"
                      aria-label={`Delete ${category.title}`}
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
