"use client";

import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPackage,
} from "react-icons/fi";
import { AdminMeta } from "../../../../lib/api/admin/order";
import { Order } from "../../../../lib/api/orders";
import { statusLabel, statusTone } from "./helpers";
import { formatByPaymentMethod } from "../../../../lib/currency";

export default function OrderTable({
  orders,
  meta,
  limit,
  loading,
  pageLabel,
  onLimitChange,
  onView,
  onPrevious,
  onNext,
}: {
  orders: Order[];
  meta: AdminMeta;
  limit: number;
  loading: boolean;
  pageLabel: string;
  onLimitChange: (limit: number) => void;
  onView: (order: Order) => void;
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

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <FiPackage size={22} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-950">No orders found</h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FiPackage size={18} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Orders</h2>
            <p className="text-xs font-semibold text-slate-500">{pageLabel}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Placed</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="text-sm transition hover:bg-slate-50">
                <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-950">
                  {order.orderNumber}
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {formatByPaymentMethod(order.total, order.paymentMethod)}
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone(order.status)}`}>
                    {statusLabel[order.status] || order.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.96]"
                      aria-label={`View order ${order.orderNumber}`}
                    >
                      <FiEye size={15} />
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
