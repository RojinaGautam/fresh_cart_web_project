"use client";

import {
  FiCalendar,
  FiCheckCircle,
  FiHash,
  FiMail,
  FiPhone,
  FiShield,
  FiX,
} from "react-icons/fi";
import { FreshCartUser } from "../../../../lib/api/auth";
import Modal from "../../_components/Modal";

export default function ViewUserModal({
  user,
  onClose,
}: {
  user: FreshCartUser;
  onClose: () => void;
}) {
  const details = [
    { label: "User ID", value: user.id, icon: FiHash },
    { label: "Email", value: user.email, icon: FiMail },
    { label: "Phone", value: user.phoneNumber, icon: FiPhone },
    { label: "Role", value: user.role, icon: FiShield },
    {
      label: "Created",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "Not available",
      icon: FiCalendar,
    },
  ];

  return (
    <Modal>
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-6">
          <div className="absolute right-8 top-5 h-24 w-24 rounded-full bg-emerald-100/70 blur-2xl" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900 active:scale-[0.96]"
            aria-label="Close user details"
          >
            <FiX size={18} />
          </button>

          <div className="relative flex flex-col gap-5 pr-12 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-600 text-3xl font-semibold text-white shadow-lg shadow-emerald-900/15">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  User Profile
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                  <FiCheckCircle size={12} />
                  Active
                </span>
              </div>
              <h2 className="mt-2 truncate text-2xl font-semibold text-slate-950">
                {user.fullName}
              </h2>
              <p className="mt-1 truncate text-sm font-medium text-slate-500">
                {user.email}
              </p>
              <span
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  user.role === "admin"
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                    : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-6 py-5 sm:grid-cols-2">
          {details.map((detail) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className={`group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-100 hover:bg-emerald-50/30 ${
                  detail.label === "User ID" ? "sm:col-span-2" : ""
                }`}
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition group-hover:bg-white">
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {detail.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-950">
                    {detail.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
