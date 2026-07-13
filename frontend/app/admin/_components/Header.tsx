"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBox,
  FiGift,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMessageCircle,
  FiPackage,
  FiSearch,
  FiUsers,
} from "react-icons/fi";
import { FreshCartUser } from "../../../lib/api/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/products", label: "Products", icon: FiBox },
  { href: "/admin/categories", label: "Categories", icon: FiGrid },
  { href: "/admin/deals", label: "Deals", icon: FiGift },
  { href: "/admin/orders", label: "Orders", icon: FiPackage },
  { href: "/admin/support", label: "Support", icon: FiMessageCircle },
];

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/admin/users")) return "User Management";
  if (pathname.startsWith("/admin/products")) return "Product Management";
  if (pathname.startsWith("/admin/categories")) return "Category Management";
  if (pathname.startsWith("/admin/deals")) return "Deal Management";
  if (pathname.startsWith("/admin/orders")) return "Order Management";
  if (pathname.startsWith("/admin/support")) return "Support Tickets";
  return "Admin Dashboard";
};

export function AdminSidebar({
  user,
  onLogout,
}: {
  user: FreshCartUser | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-[282px] shrink-0 border-r border-[#d8e2d4] bg-[#f7faf4] px-5 py-5 lg:sticky lg:top-0 lg:flex lg:flex-col">
      <Link href="/admin" className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-[#d8e2d4]">
        <Image
          src="/logo.png"
          alt="FreshCart logo"
          width={42}
          height={42}
          className="h-11 w-11 rounded-xl object-cover"
          priority
        />
        <div>
          <p className="text-lg font-semibold text-[#08743a]">FreshCart</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Admin Portal
          </p>
        </div>
      </Link>

      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#08743a] text-white shadow-lg shadow-emerald-950/10"
                  : "text-slate-600 hover:bg-white hover:text-[#08743a] hover:shadow-sm"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isActive ? "bg-white/15 text-white" : "bg-white text-[#08743a]"
                }`}
              >
                <Icon size={17} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#d8e2d4] pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Signed in as
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-[#08743a]">
            {user?.fullName?.charAt(0).toUpperCase() || "A"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#15251b]">
              {user?.fullName || "Admin"}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-4 flex w-full items-center justify-start gap-2 rounded-2xl px-2 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          <FiLogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#d8e2d4] bg-[#f7faf4]/95 backdrop-blur">
      <div className="flex min-h-16 w-full flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            FreshCart Admin
          </p>
          <h1 className="text-xl font-semibold text-[#15251b]">
            {getPageTitle(pathname)}
          </h1>
        </div>

        <div className="order-last flex w-full items-center gap-3 md:order-none md:w-auto md:flex-1 md:justify-center">
          <div className="relative w-full max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Search users, orders..."
              className="h-11 w-full rounded-full border border-[#d8e2d4] bg-white px-10 text-sm font-normal outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50"
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm ${
                  isActive ? "bg-[#08743a] text-white" : "bg-white text-slate-700"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
