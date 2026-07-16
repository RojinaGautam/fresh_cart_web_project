"use client";

import { FormEvent } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { AdminDealFormPayload } from "../../../../lib/api/admin/deal";
import { Product } from "../../../../lib/api/products";
import { uploadAdminDealImageAction } from "../../../../lib/actions/admin/upload-action";
import ImageUploadField from "../../_components/ImageUploadField";
import Modal from "../../_components/Modal";

export default function DealFormModal({
  form,
  mode,
  products,
  error,
  saving,
  onChange,
  onClose,
  onSubmit,
}: {
  form: AdminDealFormPayload;
  mode: "create" | "edit";
  products: Product[];
  error: string;
  saving: boolean;
  onChange: (form: AdminDealFormPayload) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Modal>
      <form
        onSubmit={onSubmit}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              {mode === "edit" ? "Edit Deal" : "Create Deal"}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              {mode === "edit" ? "Update Deal Details" : "Add New Deal"}
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

        <div className="grid gap-4 px-6 py-5">
          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Title</span>
            <input
              value={form.title}
              onChange={(event) => onChange({ ...form, title: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => onChange({ ...form, description: event.target.value })}
              rows={3}
              className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Product</span>
            <select
              value={form.product}
              onChange={(event) => onChange({ ...form, product: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <ImageUploadField
            label="Deal Image"
            value={form.image}
            onChange={(path) => onChange({ ...form, image: path })}
            uploadAction={uploadAdminDealImageAction}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Discount %</span>
              <input
                value={form.discountPercentage}
                onChange={(event) =>
                  onChange({ ...form, discountPercentage: event.target.value })
                }
                placeholder="30"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-700">Badge</span>
              <input
                value={form.badge}
                onChange={(event) => onChange({ ...form, badge: event.target.value })}
                placeholder="30% off, Fresh pick..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

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
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Deal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
