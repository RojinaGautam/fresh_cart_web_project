"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { getAdminUsersApi } from "../../lib/api/admin-users";
import { FreshCartUser } from "../../lib/api/auth";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<FreshCartUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminUsersApi({
        page: 1,
        limit: 5,
        search: "",
      });

      setUsers(response.data);
      setTotalUsers(response.meta.total);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load admin dashboard"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fetchDashboard]);

  const adminCount = users.filter((user) => user.role === "admin").length;

  return (
    <section className="space-y-5">
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              FreshCart Admin
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#17251d]">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage users, review account access, and keep FreshCart customer
              data organized from one protected dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-md bg-[#079b3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#087f35]"
            >
              <FiUsers size={16} />
              Manage Users
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700 hover:bg-green-100"
            >
              <FiPlus size={16} />
              Create User
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-green-50 text-green-700">
            <FiUsers size={20} />
          </span>
          <p className="mt-4 text-xs font-bold uppercase text-gray-500">
            Total Users
          </p>
          <p className="mt-2 text-3xl font-bold text-[#17251d]">
            {loading ? "..." : totalUsers}
          </p>
        </article>

        <article className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-green-50 text-green-700">
            <FiShield size={20} />
          </span>
          <p className="mt-4 text-xs font-bold uppercase text-gray-500">
            Admins Visible
          </p>
          <p className="mt-2 text-3xl font-bold text-[#17251d]">
            {loading ? "..." : adminCount}
          </p>
        </article>

        <article className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-green-50 text-green-700">
            <FiActivity size={20} />
          </span>
          <p className="mt-4 text-xs font-bold uppercase text-gray-500">
            System Status
          </p>
          <p className="mt-2 text-3xl font-bold text-[#17251d]">Active</p>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-[#17251d]">
                Recent Users
              </h2>
              <p className="text-xs font-medium text-gray-500">
                Latest accounts from the admin API.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-green-50 hover:text-green-700"
            >
              <FiRefreshCw size={14} />
              Refresh
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <p className="px-5 py-8 text-center text-sm font-bold text-green-700">
                Loading dashboard...
              </p>
            ) : users.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm font-semibold text-gray-500">
                No users found.
              </p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold text-[#17251d]">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#17251d]">Quick Actions</h2>
          <Link
            href="/admin/users"
            className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-[#17251d] hover:bg-green-50 hover:text-green-700"
          >
            View Users
            <FiArrowRight size={15} />
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-[#17251d] hover:bg-green-50 hover:text-green-700"
          >
            Add User
            <FiArrowRight size={15} />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-[#17251d] hover:bg-green-50 hover:text-green-700"
          >
            Customer Area
            <FiShoppingBag size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
