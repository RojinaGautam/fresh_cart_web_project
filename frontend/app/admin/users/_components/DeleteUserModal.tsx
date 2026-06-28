"use client";

import { FiAlertTriangle } from "react-icons/fi";
import { FreshCartUser } from "../../../../lib/api/auth";

export default function DeleteUserModal({
  user,
  deleting,
  onCancel,
  onConfirm,
}: {
  user: FreshCartUser;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <FiAlertTriangle size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#17251d]">Delete user?</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This will permanently delete {user.fullName}. This action cannot
              be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
