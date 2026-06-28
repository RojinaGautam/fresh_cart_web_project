"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiPlus, FiSearch } from "react-icons/fi";
import {
  AdminUserFormPayload,
  AdminUsersMeta,
  createAdminUserApi,
  deleteAdminUserApi,
  getAdminUserApi,
  getAdminUsersApi,
  updateAdminUserApi,
} from "../../../lib/api/admin-users";
import { FreshCartUser } from "../../../lib/api/auth";
import DeleteUserModal from "./_components/DeleteUserModal";
import {
  emptyUserForm,
  getErrorMessage,
  validateUserForm,
} from "./_components/helpers";
import UserFormModal from "./_components/UserFormModal";
import UsersTable from "./_components/UsersTable";
import ViewUserModal from "./_components/ViewUserModal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<FreshCartUser[]>([]);
  const [meta, setMeta] = useState<AdminUsersMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
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
        limit: meta.limit,
        search,
      });

      setUsers(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load users"));
    } finally {
      setLoading(false);
    }
  }, [meta.limit, page, search]);

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

  return (
    <section className="space-y-5">
      <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              Admin Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#17251d]">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
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
                placeholder="Search by ID, name, or email..."
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-10 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-md bg-[#079b3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#087f35]"
            >
              <FiPlus size={16} />
              Create User
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500">
            Total Users
          </p>
          <p className="mt-2 text-3xl font-bold text-[#17251d]">{meta.total}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500">
            Current Page
          </p>
          <p className="mt-2 text-3xl font-bold text-[#17251d]">{meta.page}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-gray-500">
            Admins Visible
          </p>
          <p className="mt-2 text-3xl font-bold text-[#17251d]">
            {users.filter((user) => user.role === "admin").length}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-md border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
          <FiAlertTriangle className="mt-0.5" size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <p className="rounded-md bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {successMessage}
        </p>
      )}

      <UsersTable
        users={users}
        meta={meta}
        loading={loading}
        pageLabel={pageLabel}
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
