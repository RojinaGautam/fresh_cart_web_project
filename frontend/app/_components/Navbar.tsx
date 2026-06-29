"use client";

import Link from "next/link";
import {
  FiHeart,
  FiMapPin,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { FreshCartUser } from "../../lib/api/auth";
import Logo from "./Logo";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const navItems = [
  { href: "/dashboard", label: "Shop" },
  { href: "/dashboard", label: "Deals" },
  { href: "/dashboard", label: "About" },
  { href: "/dashboard", label: "Support" },
];

export const getProfileImageUrl = (profileImage?: string | null) => {
  if (!profileImage) return "";
  if (profileImage.startsWith("http")) return profileImage;
  return `${apiUrl}${profileImage}`;
};

export function Avatar({
  user,
  className = "h-10 w-10 text-sm",
}: {
  user: FreshCartUser;
  className?: string;
}) {
  const imageUrl = getProfileImageUrl(user.profileImage);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={user.fullName}
        className={`${className} rounded-full object-cover ring-2 ring-green-100`}
      />
    );
  }

  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-green-600 font-bold text-white ring-2 ring-green-100`}
    >
      {user.fullName.charAt(0).toUpperCase()}
    </span>
  );
}

export default function Navbar({
  user,
  variant,
}: {
  user?: FreshCartUser | null;
  variant: "account" | "storefront";
}) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div
        className={`mx-auto flex min-h-16 w-full flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8 ${
          variant === "storefront" ? "max-w-[1500px]" : "max-w-6xl"
        }`}
      >
        <Logo />

        {variant === "storefront" && (
          <div className="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-[11px] font-bold text-gray-600 lg:flex">
            <FiMapPin className="text-green-700" size={13} />
            Deliver to New York, 10001
          </div>
        )}

        <nav className="hidden items-center gap-6 text-xs font-medium text-[#26332b] md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="hover:text-green-700">
              {item.label}
            </Link>
          ))}
        </nav>

        {variant === "storefront" && (
          <div className="order-last flex w-full items-center rounded-full bg-gray-100 px-3 py-2 text-gray-500 md:order-none md:max-w-[220px]">
            <FiSearch size={14} />
            <input
              placeholder="Search fresh produce..."
              className="ml-2 w-full bg-transparent text-xs font-medium outline-none placeholder:text-gray-400"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Saved products"
            className="hidden h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-green-50 hover:text-green-700 sm:flex"
          >
            <FiHeart size={15} />
          </button>
          <button
            type="button"
            aria-label="Cart"
            className="hidden h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-green-50 hover:text-green-700 sm:flex"
          >
            <FiShoppingCart size={15} />
          </button>
          {user && (
            <Link
              href="/dashboard/profile"
              aria-label="Go to profile"
              title="Profile"
              className={`flex items-center gap-2 rounded-full border border-green-100 bg-green-50 text-xs font-bold text-green-700 transition hover:bg-green-100 ${
                variant === "storefront"
                  ? "h-8 w-8 justify-center p-0"
                  : "px-2.5 py-1"
              }`}
            >
              {variant === "storefront" ? (
                <FiUser size={15} />
              ) : (
                <>
                  <Avatar user={user} className="h-6 w-6 text-[10px]" />
                  <span>Profile</span>
                </>
              )}
            </Link>
          )}
          {variant === "storefront" && !user && (
            <Link
              href="/login"
              className="rounded-md bg-[#079b3b] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#087f35]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
