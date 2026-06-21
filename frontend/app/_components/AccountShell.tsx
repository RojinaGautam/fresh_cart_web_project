"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiCreditCard,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../lib/contexts/AuthContext";
import Footer from "./Footer";
import Navbar, { Avatar, getProfileImageUrl } from "./Navbar";

const accountItems = [
  { href: "/dashboard/profile", label: "Personal Info", icon: FiUser },
  { href: "/dashboard", label: "Order History", icon: FiPackage },
  { href: "/dashboard", label: "Saved Addresses", icon: FiMapPin },
  { href: "/dashboard/password", label: "Password", icon: FiCreditCard },
];

export { Avatar, getProfileImageUrl };

function AccountSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="rounded-md border border-gray-100 bg-white p-3 shadow-sm">
      <div className="space-y-1">
        {accountItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2 text-xs font-bold transition ${
                active
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="mt-8 flex w-full items-center gap-3 rounded px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50"
      >
        <FiLogOut size={14} />
        Sign Out
      </button>
    </aside>
  );
}

export default function AccountShell({
  children,
  variant = "account",
}: {
  children: React.ReactNode;
  variant?: "account" | "storefront";
}) {
  const router = useRouter();
  const { logout, user } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-[#f5f6f4] text-[#182d1f]">
      <Navbar user={user} variant={variant} />

      {variant === "account" ? (
        <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[220px_1fr]">
          <AccountSidebar onLogout={handleLogout} />
          <div>{children}</div>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-5 py-6">{children}</section>
      )}

      <Footer />
    </main>
  );
}
