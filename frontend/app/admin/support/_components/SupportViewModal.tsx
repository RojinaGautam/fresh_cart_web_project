"use client";

import { FiCheck, FiX } from "react-icons/fi";
import { SupportTicket } from "../../../../lib/api/support";
import Modal from "../../_components/Modal";

export default function SupportViewModal({
  ticket,
  saving,
  error,
  onClose,
  onResolve,
}: {
  ticket: SupportTicket;
  saving: boolean;
  error: string;
  onClose: () => void;
  onResolve: () => void;
}) {
  return (
    <Modal>
      <div className="w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Support Ticket
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{ticket.subject}</h2>
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

        <div className="space-y-4 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Name</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{ticket.name}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Email</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{ticket.email}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">Message</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-900">
              {ticket.message}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {ticket.status === "resolved" ? "Resolved" : "Open"}
              </p>
            </div>
          </div>

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
            disabled={saving || ticket.status === "resolved"}
            onClick={onResolve}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiCheck size={15} />
            {saving ? "Saving..." : "Mark Resolved"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
