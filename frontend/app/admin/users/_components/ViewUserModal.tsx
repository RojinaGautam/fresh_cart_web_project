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
      <div className="w-full max-w-xl rounded-md bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                User Profile
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#17251d]">
                {user.fullName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
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
                className="flex items-start gap-3 rounded-md border border-gray-100 bg-gray-50 p-3"
              >
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-white text-green-700">
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase text-gray-500">
                    {detail.label}
                  </p>
                  <p className="break-words text-sm font-bold text-[#17251d]">
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
