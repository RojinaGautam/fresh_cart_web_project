"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useUrlSearch } from "../../../lib/hooks/useUrlSearch";
import { FiAlertTriangle, FiPlus, FiSearch } from "react-icons/fi";
import {
  createAdminCategoryAction,
  deleteAdminCategoryAction,
  getAdminCategoriesAction,
  updateAdminCategoryAction,
} from "../../../lib/actions/admin/category-action";
import { AdminCategoryFormPayload } from "../../../lib/api/admin/category";
import { Category } from "../../../lib/api/categories";
import CategoryFormModal from "./_components/CategoryFormModal";
import CategoryTable from "./_components/CategoryTable";
import DeleteCategoryModal from "./_components/DeleteCategoryModal";
import { emptyCategoryForm, getErrorMessage, validateCategoryForm } from "./_components/helpers";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useUrlSearch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState<AdminCategoryFormPayload>(emptyCategoryForm);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminCategoriesAction({ page: 1, limit: 100, search });

      if (!response.success) {
        setError(response.message || "Unable to load categories");
        return;
      }

      setCategories(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load categories"));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchCategories();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [fetchCategories]);

  const openCreateModal = () => {
    setForm(emptyCategoryForm);
    setEditingCategory(null);
    setFormError("");
    setSuccessMessage("");
    setModalMode("create");
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({
      title: category.title,
      slug: category.slug,
      image: category.image,
      description: category.description,
      isActive: category.isActive,
    });
    setFormError("");
    setSuccessMessage("");
    setModalMode("edit");
  };

  const closeFormModal = () => {
    setModalMode(null);
    setEditingCategory(null);
    setForm(emptyCategoryForm);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!modalMode) return;

    setFormError("");
    setSuccessMessage("");

    const validationError = validateCategoryForm(form);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);

      const response =
        modalMode === "edit" && editingCategory
          ? await updateAdminCategoryAction(editingCategory.id, form)
          : await createAdminCategoryAction(form);

      if (!response.success) {
        setFormError(response.message || "Unable to save category");
        return;
      }

      setSuccessMessage(
        modalMode === "edit" ? "Category updated successfully" : "Category created successfully",
      );
      closeFormModal();
      await fetchCategories();
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to save category"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      setDeleting(true);
      setError("");
      const response = await deleteAdminCategoryAction(deleteCategory.id);

      if (!response.success) {
        setError(response.message || "Unable to delete category");
        return;
      }

      setSuccessMessage("Category deleted successfully");
      setDeleteCategory(null);
      await fetchCategories();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete category"));
    } finally {
      setDeleting(false);
    }
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
              Category Management
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Search, create, edit, and delete FreshCart categories.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[320px]">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or slug..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.98]"
            >
              <FiPlus size={16} />
              Create Category
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

      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={openEditModal}
        onDelete={setDeleteCategory}
      />

      {modalMode && (
        <CategoryFormModal
          form={form}
          mode={modalMode}
          error={formError}
          saving={saving}
          onChange={setForm}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryModal
          category={deleteCategory}
          deleting={deleting}
          onCancel={() => setDeleteCategory(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}
