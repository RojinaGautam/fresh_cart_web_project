"use client";

import { FormEvent } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { AdminProductFormPayload } from "../../../../lib/api/admin/product";
import { Category } from "../../../../lib/api/categories";
import { uploadAdminProductImageAction } from "../../../../lib/actions/admin/upload-action";
import ImageUploadField from "../../_components/ImageUploadField";
import Modal from "../../_components/Modal";

type ProductFormModalProps = {
  form: AdminProductFormPayload;
  mode: "create" | "edit";
  categories: Category[];
  error: string;
  saving: boolean;
  onChange: (form: AdminProductFormPayload) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ProductFormModal({
  form,
  mode,
  categories,
  error,
  saving,
  onChange,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  return (
    <Modal>
      <form
        onSubmit={onSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              {mode === "edit" ? "Edit Product" : "Create Product"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {mode === "edit" ? "Update Product Details" : "Add New Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-[0.96]"
            aria-label="Close form"
          >
            <FiX size={17} />
          </button>
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Name</span>
            <input
              value={form.name}
              onChange={(event) => onChange({ ...form, name: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Slug</span>
            <input
              value={form.slug}
              onChange={(event) => onChange({ ...form, slug: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Category</span>
            <select
              value={form.category}
              onChange={(event) => onChange({ ...form, category: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Price (USD)</span>
            <input
              value={form.price}
              onChange={(event) => onChange({ ...form, price: event.target.value })}
              placeholder="3.60"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Unit</span>
            <input
              value={form.unit}
              onChange={(event) => onChange({ ...form, unit: event.target.value })}
              placeholder="/lb, /pc, /bottle..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Stock</span>
            <input
              value={form.stock}
              onChange={(event) => onChange({ ...form, stock: event.target.value })}
              placeholder="100"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Tag</span>
            <input
              value={form.tag}
              onChange={(event) => onChange({ ...form, tag: event.target.value })}
              placeholder="Organic, Popular..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="md:col-span-2">
            <ImageUploadField
              label="Product Image"
              value={form.image}
              onChange={(path) => onChange({ ...form, image: path })}
              uploadAction={uploadAdminProductImageAction}
            />
          </div>

          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => onChange({ ...form, description: event.target.value })}
              rows={3}
              className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => onChange({ ...form, isFeatured: event.target.checked })}
              className="h-4 w-4 accent-emerald-600"
            />
            <span className="text-sm font-semibold text-slate-700">Featured</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => onChange({ ...form, isActive: event.target.checked })}
              className="h-4 w-4 accent-emerald-600"
            />
            <span className="text-sm font-semibold text-slate-700">Active</span>
          </label>
        </div>

        {error && (
          <p className="mx-6 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave size={15} />
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
