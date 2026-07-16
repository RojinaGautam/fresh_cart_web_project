"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { FiAlertTriangle, FiPlus } from "react-icons/fi";
import {
  createAdminDealAction,
  deleteAdminDealAction,
  getAdminDealsAction,
  updateAdminDealAction,
} from "../../../lib/actions/admin/deal-action";
import { getProductsAction } from "../../../lib/actions/products-action";
import { AdminDealFormPayload } from "../../../lib/api/admin/deal";
import { Deal } from "../../../lib/api/deals";
import { Product } from "../../../lib/api/products";
import DealFormModal from "./_components/DealFormModal";
import DealTable from "./_components/DealTable";
import DeleteDealModal from "./_components/DeleteDealModal";
import { emptyDealForm, getErrorMessage, validateDealForm } from "./_components/helpers";

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState<AdminDealFormPayload>(emptyDealForm);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deleteDeal, setDeleteDeal] = useState<Deal | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminDealsAction({ page: 1, limit: 100 });

      if (!response.success) {
        setError(response.message || "Unable to load deals");
        return;
      }

      setDeals(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load deals"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchDeals();
      void (async () => {
        const response = await getProductsAction({ limit: 200 });
        if (response.success) {
          setProducts(response.data as Product[]);
        }
      })();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fetchDeals]);

  const openCreateModal = () => {
    setForm(emptyDealForm);
    setEditingDeal(null);
    setFormError("");
    setSuccessMessage("");
    setModalMode("create");
  };

  const openEditModal = (deal: Deal) => {
    setEditingDeal(deal);
    setForm({
      title: deal.title,
      description: deal.description,
      product: deal.product?.id || "",
      image: deal.image || "",
      discountPercentage: String(deal.discountPercentage),
      badge: deal.badge,
      isActive: deal.isActive,
    });
    setFormError("");
    setSuccessMessage("");
    setModalMode("edit");
  };

  const closeFormModal = () => {
    setModalMode(null);
    setEditingDeal(null);
    setForm(emptyDealForm);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!modalMode) return;

    setFormError("");
    setSuccessMessage("");

    const validationError = validateDealForm(form);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);

      const response =
        modalMode === "edit" && editingDeal
          ? await updateAdminDealAction(editingDeal.id, form)
          : await createAdminDealAction(form);

      if (!response.success) {
        setFormError(response.message || "Unable to save deal");
        return;
      }

      setSuccessMessage(
        modalMode === "edit" ? "Deal updated successfully" : "Deal created successfully",
      );
      closeFormModal();
      await fetchDeals();
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to save deal"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDeal) return;

    try {
      setDeleting(true);
      setError("");
      const response = await deleteAdminDealAction(deleteDeal.id);

      if (!response.success) {
        setError(response.message || "Unable to delete deal");
        return;
      }

      setSuccessMessage("Deal deleted successfully");
      setDeleteDeal(null);
      await fetchDeals();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete deal"));
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
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">Deal Management</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Create, edit, and delete FreshCart promotional deals.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            <FiPlus size={16} />
            Create Deal
          </button>
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

      <DealTable deals={deals} loading={loading} onEdit={openEditModal} onDelete={setDeleteDeal} />

      {modalMode && (
        <DealFormModal
          form={form}
          mode={modalMode}
          products={products}
          error={formError}
          saving={saving}
          onChange={setForm}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
      )}

      {deleteDeal && (
        <DeleteDealModal
          deal={deleteDeal}
          deleting={deleting}
          onCancel={() => setDeleteDeal(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}
