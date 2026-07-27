"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useUrlSearch } from "../../../lib/hooks/useUrlSearch";
import { FiAlertTriangle, FiPlus, FiSearch } from "react-icons/fi";
import {
  AdminUserFormPayload,
  AdminUsersMeta,
  createAdminUserApi,
  deleteAdminUserApi,
  getAdminUserApi,
  getAdminUsersApi,
  updateAdminUserApi,
} from "../../../lib/api/admin/user";
import { FreshCartUser } from "../../../lib/api/auth";
import DeleteUserModal from "./_components/DeleteUserModal";
import {
  emptyUserForm,
  getErrorMessage,
  validateUserForm,
} from "./_components/helpers";
import UserFormModal from "./_components/UserFormModal";
import UserTable from "./_components/UserTable";
import ViewUserModal from "./_components/ViewUserModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<FreshCartUser[]>([]);
  const [meta, setMeta] = useState<AdminUsersMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useUrlSearch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState<AdminUserFormPayload>(emptyUserForm);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<FreshCartUser | null>(null);
  const [viewUser, setViewUser] = useState<FreshCartUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<FreshCartUser | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsersApi({
        page,
        limit,
        search,
      });

      setUsers(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load users"));
    } finally {
      setLoading(false);
    }
  }, [limit, page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchUsers();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [fetchUsers]);

  const openCreateModal = () => {
    setForm(emptyUserForm);
    setEditingUser(null);
    setFormError("");
    setSuccessMessage("");
    setModalMode("create");
  };

  const openEditModal = (user: FreshCartUser) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role === "admin" ? "admin" : "user",
      password: "",
    });
    setFormError("");
    setSuccessMessage("");
    setModalMode("edit");
  };

  const closeFormModal = () => {
    setModalMode(null);
    setEditingUser(null);
    setForm(emptyUserForm);
    setFormError("");
  };

  const handleView = async (user: FreshCartUser) => {
    try {
      setError("");
      const response = await getAdminUserApi(user.id);
      setViewUser(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load user details"));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!modalMode) return;

    setFormError("");
    setSuccessMessage("");

    const validationError = validateUserForm(form, modalMode);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);
      const payload: AdminUserFormPayload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        role: form.role,
        password: form.password?.trim(),
      };

      if (modalMode === "edit" && editingUser) {
        if (!payload.password) {
          delete payload.password;
        }

        await updateAdminUserApi(editingUser.id, payload);
        setSuccessMessage("User updated successfully");
      } else {
        await createAdminUserApi(payload);
        setSuccessMessage("User created successfully");
      }

      closeFormModal();
      await fetchUsers();
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to save user"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeleting(true);
      setError("");
      await deleteAdminUserApi(deleteUser.id);
      setSuccessMessage("User deleted successfully");
      setDeleteUser(null);
      await fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete user"));
    } finally {
      setDeleting(false);
    }
  };

  const pageLabel = useMemo(() => {
    if (!meta.total) return "0 users";

    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);
    return `${start}-${end} of ${meta.total} users`;
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
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">
              User Management
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Search, view, create, edit, and delete FreshCart accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[360px]">
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
                placeholder="Search by name or email..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.98]"
            >
              <FiPlus size={16} />
              Create User
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Total Users
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{meta.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Current Page
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{meta.page}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Admins Visible
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {users.filter((user) => user.role === "admin").length}
          </p>
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

      <UserTable
        users={users}
        meta={meta}
        limit={limit}
        loading={loading}
        pageLabel={pageLabel}
        onLimitChange={handleLimitChange}
        onView={handleView}
        onEdit={openEditModal}
        onDelete={setDeleteUser}
        onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
        onNext={() => setPage((current) => current + 1)}
      />

      {modalMode && (
        <UserFormModal
          form={form}
          mode={modalMode}
          error={formError}
          saving={saving}
          onChange={setForm}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
      )}

      {viewUser && (
        <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />
      )}

      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          deleting={deleting}
          onCancel={() => setDeleteUser(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}
