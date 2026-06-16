"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHeart,
  FiHome,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiShoppingBag,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { FreshCartUser } from "../../lib/api/auth";
import { useAuth } from "../../lib/context/AuthContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/profile", label: "Profile", icon: FiUser },
  { href: "/account-settings", label: "Settings", icon: FiSettings },
];

const stats = [
  { label: "Orders", value: "12", icon: FiPackage },
  { label: "Saved", value: "28", icon: FiHeart },
  { label: "Reviews", value: "7", icon: FiStar },
];

export const getProfileImageUrl = (profileImage?: string | null) => {
  if (!profileImage) return "";
  if (profileImage.startsWith("http")) return profileImage;
  return `${apiUrl}${profileImage}`;
};

function Avatar({ user, size = "large" }: { user: FreshCartUser; size?: "large" | "small" }) {
  const imageUrl = getProfileImageUrl(user.profileImage);
  const sizeClass = size === "large" ? "h-24 w-24 text-3xl" : "h-11 w-11 text-base";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={user.fullName}
        className={`${sizeClass} rounded-full border-4 border-white object-cover shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full border-4 border-white bg-green-600 font-bold text-white shadow-sm`}
    >
      {user.fullName.charAt(0).toUpperCase()}
    </div>
  );
}

export default function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-[#f5fbf3]">
      <section className="bg-gradient-to-r from-green-700 via-green-600 to-lime-500 px-5 pb-16 pt-6 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-green-700">
              <FiShoppingBag size={22} />
            </span>
            <span className="text-2xl font-black">FreshCart</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-white text-green-700"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md bg-[#10263a] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#193b58]"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar user={user} />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-green-100">
                FreshCart member
              </p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">
                {user.fullName}
              </h1>
              <p className="mt-2 text-sm text-green-50">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-lg bg-white/15 px-4 py-3 text-center backdrop-blur"
                >
                  <Icon className="mx-auto mb-1" size={18} />
                  <p className="text-xl font-black">{stat.value}</p>
                  <p className="text-xs font-semibold text-green-50">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-6xl px-5 pb-12">
        {children}
      </section>
    </main>
  );
}
