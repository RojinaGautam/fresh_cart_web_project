"use client";

import { FormEvent } from "react";
import { FiSave, FiX } from "react-icons/fi";
import { AdminUserFormPayload } from "../../../../lib/api/admin-users";

type UserFormModalProps = {
  form: AdminUserFormPayload;
  mode: "create" | "edit";
  error: string;
  saving: boolean;
  onChange: (form: AdminUserFormPayload) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function UserFormModal({
  form,
  mode,
  error,
  saving,
  onChange,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <form
        onSubmit={onSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              {mode === "edit" ? "Edit Account" : "Create Account"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#17251d]">
              {mode === "edit" ? "Update User Details" : "Add New User"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === "edit"
                ? "Leave password blank to keep the current password."
                : "Create a customer or admin account."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Close form"
          >
            <FiX size={17} />
          </button>
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold text-gray-700">Full Name</span>
            <input
              value={form.fullName}
              onChange={(event) =>
                onChange({ ...form, fullName: event.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-gray-700">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                onChange({ ...form, email: event.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-gray-700">
              Phone Number
            </span>
            <input
              value={form.phoneNumber}
              onChange={(event) =>
                onChange({ ...form, phoneNumber: event.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-gray-700">Role</span>
            <select
              value={form.role}
              onChange={(event) =>
                onChange({
                  ...form,
                  role: event.target.value as "admin" | "user",
                })
              }
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-bold text-[#17251d] outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs font-bold text-gray-700">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                onChange({ ...form, password: event.target.value })
              }
              placeholder={
                mode === "edit" ? "Leave blank to keep password" : "Password"
              }
              className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </label>
        </div>

        {error && (
          <p className="mx-6 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#079b3b] px-4 py-2 text-sm font-bold text-white hover:bg-[#087f35] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave size={15} />
            {saving
              ? "Saving..."
              : mode === "edit"
                ? "Save Changes"
                : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
