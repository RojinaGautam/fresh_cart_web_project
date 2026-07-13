"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiGift,
  FiGrid,
  FiMessageCircle,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { getAdminUsersApi } from "../../lib/api/admin/user";
import { FreshCartUser } from "../../lib/api/auth";
import { getAdminProductsAction } from "../../lib/actions/admin/product-action";
import { getAdminOrdersAction } from "../../lib/actions/admin/order-action";
import { getAdminSupportTicketsAction } from "../../lib/actions/admin/support-action";
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

const quickLinks = [
  { href: "/admin/products", label: "Manage products", icon: FiBox },
  { href: "/admin/categories", label: "Manage categories", icon: FiGrid },
  { href: "/admin/deals", label: "Manage deals", icon: FiGift },
  { href: "/admin/orders", label: "Manage orders", icon: FiPackage },
  { href: "/admin/support", label: "View support tickets", icon: FiMessageCircle },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<FreshCartUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [usersResponse, productsResponse, ordersResponse, ticketsResponse] =
        await Promise.all([
          getAdminUsersApi({ page: 1, limit: 5, search: "" }),
          getAdminProductsAction({ page: 1, limit: 1 }),
          getAdminOrdersAction({ page: 1, limit: 1 }),
          getAdminSupportTicketsAction({ page: 1, limit: 1, status: "open" }),
        ]);

      setUsers(usersResponse.data);
      setTotalUsers(usersResponse.meta.total);
      setTotalProducts(productsResponse.success ? productsResponse.meta.total : 0);
      setTotalOrders(ordersResponse.success ? ordersResponse.meta.total : 0);
      setOpenTickets(ticketsResponse.success ? ticketsResponse.meta.total : 0);
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
      <div className="overflow-hidden rounded-3xl border border-[#d8e2d4] bg-white shadow-sm">
        <div className="relative px-6 py-7 sm:px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#173822] via-[#08743a] to-[#dfeadb]" />
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_24%),radial-gradient(circle_at_80%_0%,white_0,transparent_20%)]" />
          <div className="relative flex flex-col gap-5 text-white lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1 ring-white/20">
                FreshCart Admin Portal
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Manage the store with a cleaner FreshCart workspace.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
                Track customers, products, orders, deals, and support tickets from one calm dashboard.
              </p>
            </div>
            <Link
              href="/admin/users"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#08743a] shadow-sm transition hover:bg-emerald-50"
            >
              Manage users
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
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
          title="Total Products"
          value={loading ? "..." : totalProducts}
          helper="Products in the catalog"
          icon={FiBox}
          tone="slate"
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : totalOrders}
          helper="Orders placed by customers"
          icon={FiPackage}
          tone="slate"
        />
        <StatCard
          title="Open Tickets"
          value={loading ? "..." : openTickets}
          helper="Support requests awaiting a reply"
          icon={FiMessageCircle}
          tone={openTickets > 0 ? "blue" : "slate"}
        />
      </div>

      <div className="rounded-3xl border border-[#d8e2d4] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#15251b]">Quick Links</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Jump straight into managing the storefront
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchDashboard()}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-[#dfeadb] px-3 py-2 text-xs font-semibold text-[#08743a] transition hover:bg-[#d3e2cf] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#f7faf4] p-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                    <Icon size={16} />
                  </span>
                  {link.label}
                </span>
                <FiArrowRight size={16} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#d8e2d4] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#15251b]">
              Recent Users
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Latest registered accounts
            </p>
          </div>
          <Link
            href="/admin/users"
            className="rounded-2xl bg-[#08743a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#075f31] active:scale-[0.98]"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-[#f7faf4] text-[11px] font-semibold uppercase text-slate-500">
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
                  <tr key={user.id} className="transition hover:bg-[#f7faf4]">
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
                        <FiCheckCircle className="mr-1 inline" size={11} />
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
