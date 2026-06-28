"use client";

import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { AdminUsersMeta } from "../../../../lib/api/admin-users";
import { FreshCartUser } from "../../../../lib/api/auth";

export default function UsersTable({
  users,
  meta,
  loading,
  pageLabel,
  onView,
  onEdit,
  onDelete,
  onPrevious,
  onNext,
}: {
  users: FreshCartUser[];
  meta: AdminUsersMeta;
  loading: boolean;
  pageLabel: string;
  onView: (user: FreshCartUser) => void;
  onEdit: (user: FreshCartUser) => void;
  onDelete: (user: FreshCartUser) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (loading) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold text-green-700">Loading users...</p>
        <p className="mt-1 text-xs text-gray-500">
          Fetching the latest admin user list.
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
          <FiUsers size={22} />
        </div>
        <h3 className="mt-4 text-base font-bold text-[#17251d]">
          No users found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try searching another ID, name, or email.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-green-700">
            <FiUsers size={18} />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#17251d]">Users</h2>
            <p className="text-xs font-medium text-gray-500">{pageLabel}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="text-sm">
                <td className="px-5 py-4 font-mono text-xs text-gray-500">
                  {user.id}
                </td>
                <td className="px-5 py-4 font-bold text-[#17251d]">
                  {user.fullName}
                </td>
                <td className="px-5 py-4 text-gray-600">{user.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Not available"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                      aria-label={`View ${user.fullName}`}
                    >
                      <FiEye size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                      aria-label={`Edit ${user.fullName}`}
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${user.fullName}`}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold text-gray-500">
          Page {meta.page} of {Math.max(meta.totalPages, 1)}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={meta.page <= 1 || loading}
            onClick={onPrevious}
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft size={14} />
            Previous
          </button>
          <button
            type="button"
            disabled={meta.page >= meta.totalPages || loading}
            onClick={onNext}
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
