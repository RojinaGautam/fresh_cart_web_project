"use client";

import { FiCalendar, FiMail, FiPhone, FiShield, FiUser, FiX } from "react-icons/fi";
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
    { label: "User ID", value: user.id, icon: FiUser },
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
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-black text-emerald-700">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                User Profile
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                {user.fullName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 active:scale-[0.96]"
            aria-label="Close user details"
          >
            <FiX size={17} />
          </button>
        </div>

        <div className="grid gap-3 px-6 py-5">
          {details.map((detail) => {
            const Icon = detail.icon;

            return (
              <div
                key={detail.label}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-700">
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase text-slate-500">
                    {detail.label}
                  </p>
                  <p className="break-words text-sm font-black text-slate-950">
                    {detail.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
