"use client";

import { usePathname } from "next/navigation";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";
import { FreshCartUser } from "../../../lib/api/auth";

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/admin/users")) return "User Management";
  return "Admin Dashboard";
};

export default function Header({
  user,
  onMenuClick,
}: {
  user: FreshCartUser | null;
  onMenuClick: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] lg:hidden"
            aria-label="Open admin menu"
          >
            <FiMenu size={19} />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              FreshCart Admin
            </p>
            <h1 className="truncate text-xl font-black text-slate-950 md:text-2xl">
              {getPageTitle(pathname)}
            </h1>
          </div>
        </div>

        <div className="hidden flex-1 justify-center px-6 md:flex">
          <div className="relative w-full max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Quick search..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 text-sm font-medium outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] sm:flex"
            aria-label="Notifications"
          >
            <FiBell size={17} />
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
              {user?.fullName?.charAt(0).toUpperCase() || "A"}
            </span>
            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-[150px] truncate text-sm font-bold text-slate-950">
                {user?.fullName || "Admin"}
              </p>
              <p className="max-w-[150px] truncate text-xs font-medium text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
