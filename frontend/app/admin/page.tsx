"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
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
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={loading ? "..." : totalUsers}
          helper="Registered FreshCart accounts"
          icon={FiUsers}
          tone="emerald"
        />
        <StatCard
          title="Active Admins"
          value={loading ? "..." : adminCount}
          helper="Admin accounts in view"
          icon={FiShield}
          tone="emerald"
        />
        <StatCard
          title="User Activity"
          value="94%"
          helper="Account health estimate"
          icon={FiTrendingUp}
          tone="slate"
        />
        <StatCard
          title="Access Score"
          value="+5.4%"
          helper="Role management stability"
          icon={FiBarChart2}
          tone="emerald"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Users Overview
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Account tracking for the current workspace
              </p>
            </div>
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="mt-8 grid min-h-[230px] place-items-end rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-5">
            <div className="flex w-full items-end justify-between gap-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => (
                  <div key={day} className="flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full max-w-10 rounded-t-xl bg-emerald-600/80"
                      style={{ height: `${48 + index * 14}px` }}
                    />
                    <span className="text-[11px] font-bold text-slate-500">
                      {day}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Account Mix
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Users by role
          </p>

          <div className="mt-6 space-y-5">
            {[
              {
                label: "Customer Users",
                percent: totalUsers ? Math.max(0, totalUsers - adminCount) : 0,
                width: "72%",
              },
              {
                label: "Admin Users",
                percent: adminCount,
                width: "36%",
              },
              { label: "Pending Reviews", percent: 0, width: "12%" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-500">{item.percent}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-700"
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/users"
            className="mt-7 flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            Manage user accounts
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Recent Users
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Latest registered accounts
            </p>
          </div>
          <Link
            href="/admin/users"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">User ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((row) => (
                  <tr key={row}>
                    <td colSpan={4} className="px-5 py-4">
                      <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
                    <p className="font-semibold text-slate-950">No users found</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Create a user to fill this table.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      #{user.id.slice(-6)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        {user.fullName}
                      </p>
                      <p className="text-sm font-medium text-slate-500">
                        {user.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Not available"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
