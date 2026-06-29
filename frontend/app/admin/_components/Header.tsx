"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiLogOut, FiSearch, FiUsers } from "react-icons/fi";
import { FreshCartUser } from "../../../lib/api/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/", label: "Home" },
];

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/admin/users")) return "User Management";
  return "Admin Dashboard";
};

export default function Header({
  user,
  onLogout,
}: {
  user: FreshCartUser | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FreshCart logo"
              width={34}
              height={34}
              className="h-9 w-9 rounded-lg object-cover"
              priority
            />
            <div>
              <p className="text-base font-semibold text-emerald-700">
                FreshCart
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Admin Portal
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-slate-100 p-1 md:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="order-last flex w-full items-center gap-3 md:order-none md:w-auto md:flex-1 md:justify-center">
          <div className="relative w-full max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search users, orders..."
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 px-10 text-sm font-normal outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              {user?.fullName?.charAt(0).toUpperCase() || "A"}
            </span>
            <div className="hidden min-w-0 lg:block">
              <p className="max-w-[140px] truncate text-sm font-medium text-slate-950">
                {user?.fullName || "Admin"}
              </p>
              <p className="max-w-[140px] truncate text-xs text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
          >
            <FiLogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        <div className="flex w-full gap-2 md:hidden">
          <Link
            href="/admin"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
          >
            <FiHome size={15} />
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
          >
            <FiUsers size={15} />
            Users
          </Link>
        </div>
      </div>
      <div className="mx-auto hidden w-full max-w-[1280px] px-4 pb-3 md:px-6 lg:px-8">
        <p className="text-sm text-slate-500">{getPageTitle(pathname)}</p>
      </div>
    </header>
  );
}
