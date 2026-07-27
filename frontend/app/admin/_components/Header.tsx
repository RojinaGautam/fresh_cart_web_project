"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  FiX,
} from "react-icons/fi";
import { FreshCartUser } from "../../../lib/api/auth";
import { AdminSearchGroup } from "../../../lib/api/admin/search";
import { adminSearchAction } from "../../../lib/actions/admin/search-action";

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

function GlobalSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [term, setTerm] = useState("");
  const [groups, setGroups] = useState<AdminSearchGroup[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);

  // Debounced so typing doesn't fire a request per keystroke. Clearing for
  // short queries is handled in the change handler so nothing is set
  // synchronously from this effect.
  useEffect(() => {
    const query = term.trim();

    if (query.length < 2) return;

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      adminSearchAction(query).then((response) => {
        if (cancelled) return;

        setGroups(response.success ? response.data.groups : []);
        setSearching(false);
      });
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [term]);

  // Close the dropdown when clicking anywhere outside it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    const isSearchable = value.trim().length >= 2;

    setTerm(value);
    setOpen(true);
    setSearching(isSearchable);

    if (!isSearchable) {
      setGroups([]);
    }
  };

  const goTo = (href: string) => {
    setOpen(false);
    setTerm("");
    router.push(href);
  };

  const hasQuery = term.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={16}
      />
      <input
        value={term}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
        placeholder="Search users, orders, products, deals..."
        aria-label="Search all admin records"
        className="h-11 w-full rounded-full border border-[#d8e2d4] bg-white px-10 text-sm font-normal outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50"
      />
      {term && (
        <button
          type="button"
          onClick={() => {
            setTerm("");
            setGroups([]);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          aria-label="Clear search"
        >
          <FiX size={15} />
        </button>
      )}

      {open && hasQuery && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-[#d8e2d4] bg-white p-2 shadow-xl">
          {searching ? (
            <p className="px-3 py-4 text-sm text-slate-500">Searching...</p>
          ) : groups.length === 0 ? (
            <p className="px-3 py-4 text-sm text-slate-500">
              No matches for &ldquo;{term.trim()}&rdquo;
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.key} className="mb-1 last:mb-0">
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {group.label}
                  <span className="ml-1 font-semibold text-slate-300">
                    ({group.total})
                  </span>
                </p>
                {group.hits.map((hit) => (
                  <button
                    key={hit.id}
                    type="button"
                    onClick={() => goTo(hit.href)}
                    className="block w-full rounded-xl px-3 py-2 text-left transition hover:bg-[#f2f7ef]"
                  >
                    <span className="block truncate text-sm font-semibold text-[#15251b]">
                      {hit.title}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {hit.subtitle}
                    </span>
                  </button>
                ))}
                {group.total > group.hits.length && (
                  <button
                    type="button"
                    onClick={() => goTo(group.hits[0].href)}
                    className="block w-full rounded-xl px-3 py-1.5 text-left text-xs font-semibold text-emerald-700 transition hover:bg-[#f2f7ef]"
                  >
                    View all {group.total} {group.label.toLowerCase()}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
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
          <GlobalSearch />
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
