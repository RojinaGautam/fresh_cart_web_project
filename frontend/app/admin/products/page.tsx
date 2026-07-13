"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiPlus, FiSearch } from "react-icons/fi";
import {
  createAdminProductAction,
  deleteAdminProductAction,
  getAdminProductsAction,
  updateAdminProductAction,
} from "../../../lib/actions/admin/product-action";
import { getCategoriesAction } from "../../../lib/actions/categories-action";
import { AdminMeta, AdminProductFormPayload } from "../../../lib/api/admin/product";
import { Category } from "../../../lib/api/categories";
import { Product } from "../../../lib/api/products";
import DeleteProductModal from "./_components/DeleteProductModal";
import { emptyProductForm, getErrorMessage, validateProductForm } from "./_components/helpers";
import ProductFormModal from "./_components/ProductFormModal";
import ProductTable from "./_components/ProductTable";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<AdminMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState<AdminProductFormPayload>(emptyProductForm);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminProductsAction({ page, limit, search });

      if (!response.success) {
        setError(response.message || "Unable to load products");
        return;
      }

      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load products"));
    } finally {
      setLoading(false);
    }
  }, [limit, page, search]);

  useEffect(() => {
    void (async () => {
      const response = await getCategoriesAction();
      if (response.success) {
        setCategories(response.data as Category[]);
      }
    })();
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchProducts();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [fetchProducts]);

  const openCreateModal = () => {
    setForm(emptyProductForm);
    setEditingProduct(null);
    setFormError("");
    setSuccessMessage("");
    setModalMode("create");
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      category: product.category?.id || "",
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : "",
      image: product.image,
      tag: product.tag || "",
      unit: product.unit,
      stock: String(product.stock),
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setFormError("");
    setSuccessMessage("");
    setModalMode("edit");
  };

  const closeFormModal = () => {
    setModalMode(null);
    setEditingProduct(null);
    setForm(emptyProductForm);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!modalMode) return;

    setFormError("");
    setSuccessMessage("");

    const validationError = validateProductForm(form);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);

      const response =
        modalMode === "edit" && editingProduct
          ? await updateAdminProductAction(editingProduct.id, form)
          : await createAdminProductAction(form);

      if (!response.success) {
        setFormError(response.message || "Unable to save product");
        return;
      }

      setSuccessMessage(
        modalMode === "edit" ? "Product updated successfully" : "Product created successfully",
      );
      closeFormModal();
      await fetchProducts();
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to save product"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      setDeleting(true);
      setError("");
      const response = await deleteAdminProductAction(deleteProduct.id);

      if (!response.success) {
        setError(response.message || "Unable to delete product");
        return;
      }

      setSuccessMessage("Product deleted successfully");
      setDeleteProduct(null);
      await fetchProducts();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete product"));
    } finally {
      setDeleting(false);
    }
  };

  const pageLabel = useMemo(() => {
    if (!meta.total) return "0 products";

    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);
    return `${start}-${end} of ${meta.total} products`;
  }, [meta]);

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Admin Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">
              Product Management
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Search, create, edit, and delete FreshCart products.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[360px]">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or tag..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.98]"
            >
              <FiPlus size={16} />
              Create Product
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm">
          <FiAlertTriangle className="mt-0.5" size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
          {successMessage}
        </p>
      )}

      <ProductTable
        products={products}
        meta={meta}
        limit={limit}
        loading={loading}
        pageLabel={pageLabel}
        onLimitChange={handleLimitChange}
        onEdit={openEditModal}
        onDelete={setDeleteProduct}
        onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
        onNext={() => setPage((current) => current + 1)}
      />

      {modalMode && (
        <ProductFormModal
          form={form}
          mode={modalMode}
          categories={categories}
          error={formError}
          saving={saving}
          onChange={setForm}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
      )}

      {deleteProduct && (
        <DeleteProductModal
          product={deleteProduct}
          deleting={deleting}
          onCancel={() => setDeleteProduct(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}
