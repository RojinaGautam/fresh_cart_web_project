"use client";

import Image from "next/image";
import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { Order } from "../../../../lib/api/orders";
import { resolveImageUrl } from "../../../../lib/resolveImageUrl";
import Modal from "../../_components/Modal";
import { ORDER_STATUSES, statusLabel } from "./helpers";
import { formatByPaymentMethod } from "../../../../lib/currency";

export default function OrderViewModal({
  order,
  saving,
  error,
  onClose,
  onUpdateStatus,
}: {
  order: Order;
  saving: boolean;
  error: string;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
}) {
  const [status, setStatus] = useState(order.status);

  return (
    <Modal>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Order Detail
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              #{order.orderNumber}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-[0.96]"
            aria-label="Close"
          >
            <FiX size={17} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Shipping Address</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{order.shippingAddress}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Payment Method</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{order.paymentMethod}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Delivery Date</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{order.deliveryDate}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Delivery Window</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{order.deliveryTimeSlot}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Items</p>
            <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-100">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center gap-3 p-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <Image src={resolveImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-950">
                    {formatByPaymentMethod(item.price * item.quantity, order.paymentMethod)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-4 text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-right font-semibold text-slate-900">{formatByPaymentMethod(order.subtotal, order.paymentMethod)}</span>
            <span className="text-slate-500">Delivery</span>
            <span className="text-right font-semibold text-slate-900">{formatByPaymentMethod(order.deliveryFee, order.paymentMethod)}</span>
            <span className="text-slate-500">Discount</span>
            <span className="text-right font-semibold text-slate-900">-{formatByPaymentMethod(order.discount, order.paymentMethod)}</span>
            <span className="font-semibold text-slate-950">Total</span>
            <span className="text-right font-bold text-emerald-700">{formatByPaymentMethod(order.total, order.paymentMethod)}</span>
          </div>

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Order Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              {ORDER_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {statusLabel[option]}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98]"
          >
            Close
          </button>
          <button
            type="button"
            disabled={saving || status === order.status}
            onClick={() => onUpdateStatus(status)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave size={15} />
            {saving ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
