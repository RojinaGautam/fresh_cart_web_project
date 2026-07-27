"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUrlSearch } from "../../../lib/hooks/useUrlSearch";
import { FiAlertTriangle, FiSearch } from "react-icons/fi";
import {
  getAdminSupportTicketsAction,
  updateAdminSupportStatusAction,
} from "../../../lib/actions/admin/support-action";
import { AdminMeta } from "../../../lib/api/admin/support";
import { SupportTicket } from "../../../lib/api/support";
import SupportTable from "./_components/SupportTable";
import SupportViewModal from "./_components/SupportViewModal";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [meta, setMeta] = useState<AdminMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useUrlSearch();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminSupportTicketsAction({
        page,
        limit,
        search,
        status: statusFilter || undefined,
      });

      if (!response.success) {
        setError(response.message || "Unable to load support tickets");
        return;
      }

      setTickets(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load support tickets"));
    } finally {
      setLoading(false);
    }
  }, [limit, page, search, statusFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchTickets();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [fetchTickets]);

  const handleResolve = async () => {
    if (!viewTicket) return;

    setStatusError("");
    setSaving(true);

    const response = await updateAdminSupportStatusAction(viewTicket.id, "resolved");

    setSaving(false);

    if (!response.success) {
      setStatusError(response.message || "Unable to update ticket");
      return;
    }

    setSuccessMessage(`Ticket "${viewTicket.subject}" marked resolved`);
    setViewTicket(null);
    await fetchTickets();
  };

  const pageLabel = useMemo(() => {
    if (!meta.total) return "0 tickets";

    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);
    return `${start}-${end} of ${meta.total} tickets`;
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
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">Support Tickets</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Review and resolve customer support requests.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[280px]">
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
                placeholder="Search subject, name, email..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">All statuses</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
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

      <SupportTable
        tickets={tickets}
        meta={meta}
        limit={limit}
        loading={loading}
        pageLabel={pageLabel}
        onLimitChange={handleLimitChange}
        onView={(ticket) => {
          setStatusError("");
          setViewTicket(ticket);
        }}
        onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
        onNext={() => setPage((current) => current + 1)}
      />

      {viewTicket && (
        <SupportViewModal
          ticket={viewTicket}
          saving={saving}
          error={statusError}
          onClose={() => setViewTicket(null)}
          onResolve={handleResolve}
        />
      )}
    </section>
  );
}
