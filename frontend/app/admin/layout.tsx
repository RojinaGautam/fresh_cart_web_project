"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FiGrid, FiHome, FiLogOut, FiUsers } from "react-icons/fi";
import AdminRoute from "../_components/AdminRoute";
import Logo from "../_components/Logo";
import { useAuth } from "../../lib/contexts/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: FiGrid },
    { href: "/admin/users", label: "Users", icon: FiUsers },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#f4f7f2]">
        <header className="border-b border-green-100 bg-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8">
            <div className="flex items-center gap-6">
              <Logo />
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Admin Panel
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden items-center gap-2 rounded-md px-3 py-2 text-xs font-bold text-gray-600 hover:bg-green-50 hover:text-green-700 sm:flex"
              >
                <FiHome size={15} />
                Home
              </Link>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-[#17251d]">
                  {user?.fullName}
                </p>
                <p className="text-[10px] font-semibold uppercase text-green-700">
                  Administrator
                </p>
              </div>
              <button
                type="button"
                onClick={() => logout("/")}
                className="flex items-center gap-2 rounded-md bg-[#079b3b] px-3 py-2 text-xs font-bold text-white hover:bg-[#087f35]"
              >
                <FiLogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-[1500px] gap-5 px-5 py-6 md:grid-cols-[220px_minmax(0,1fr)] md:px-8">
          <aside className="space-y-2 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-bold ${
                    isActive
                      ? "bg-[#079b3b] text-white"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </aside>
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}
