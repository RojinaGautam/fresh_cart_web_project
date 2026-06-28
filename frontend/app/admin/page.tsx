"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { getAdminUsersApi } from "../../lib/api/admin/user";
import { FreshCartUser } from "../../lib/api/auth";
import StatCard from "./_components/StatCard";

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
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:p-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              FreshCart Operations
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Control users and access with confidence.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Review account activity, create staff or customer accounts, and
              manage user access from a protected admin workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 active:scale-[0.98]"
            >
              <FiUsers size={16} />
              Manage Users
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.98]"
            >
              <FiPlus size={16} />
              Create User
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={loading ? "..." : totalUsers}
          helper="All FreshCart accounts"
          icon={FiUsers}
          tone="emerald"
        />
        <StatCard
          title="Total Admins"
          value={loading ? "..." : adminCount}
          helper="Admins visible on this page"
          icon={FiShield}
          tone="blue"
        />
        <StatCard
          title="Bookings"
          value="0"
          helper="Booking module not added"
          icon={FiShoppingBag}
          tone="indigo"
        />
        <StatCard
          title="Blogs"
          value="0"
          helper="Blog module not added"
          icon={FiFileText}
          tone="slate"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Recent Users
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Latest accounts returned by the admin API.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              disabled={loading}
              className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="space-y-3 px-5 py-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-14 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <FiUsers size={20} />
                </span>
                <h3 className="mt-3 font-black text-slate-950">
                  No users yet
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Create a user to see recent activity here.
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-black text-slate-950">
                        {user.fullName}
                      </p>
                      <p className="text-sm font-medium text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                      user.role === "admin"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FiActivity size={20} />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Quick Actions
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Common admin tasks
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { href: "/admin/users", label: "View all users" },
              { href: "/admin/users", label: "Create a user" },
              { href: "/dashboard", label: "Open customer area" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.99]"
              >
                {action.label}
                <FiArrowRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
