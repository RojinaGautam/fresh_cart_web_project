"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useState } from "react";
import {
  FiHeart,
  FiMapPin,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { FreshCartUser } from "../../lib/api/auth";
import { useCart } from "../../lib/contexts/CartContext";
import { useWishlist } from "../../lib/contexts/WishlistContext";
import { useDeliveryLocation } from "../../lib/hooks/useDeliveryLocation";
import Logo from "./Logo";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/", label: "Shop" },
  { href: "/deals", label: "Deals" },
  { href: "/support", label: "Support" },
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
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { location, status, requestLocation } = useDeliveryLocation();

  const locationLabel =
    status === "loading" ? "Locating..." : `${location.city}, ${location.country}`;

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.items.length || 0;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchTerm.trim();
    router.push(query ? `/categories?search=${encodeURIComponent(query)}` : "/categories");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfe7dc] bg-[#f7faf4]/95 backdrop-blur">
      <div
        className={`mx-auto flex min-h-16 w-full flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8 ${
          variant === "storefront" ? "max-w-[1500px]" : "max-w-6xl"
        }`}
      >
        <Logo />

        <nav className="hidden items-center gap-1 rounded-full bg-[#e9efe6] p-1 text-xs font-semibold text-[#26332b] md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-full px-4 py-2 transition ${
                isActive(item.href)
                  ? "bg-white text-green-800 shadow-sm"
                  : "hover:bg-white hover:text-green-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {variant === "storefront" && (
          <form
            onSubmit={handleSearchSubmit}
            className="order-last flex w-full items-center rounded-full bg-[#e9efe6] px-3 py-2 text-gray-600 md:order-none md:max-w-[220px]"
          >
            <FiSearch size={14} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search fresh produce..."
              className="ml-2 w-full bg-transparent text-xs font-medium outline-none placeholder:text-gray-400"
            />
          </form>
        )}

        <div className="flex items-center gap-3">
          {variant === "storefront" && (
            <button
              type="button"
              onClick={requestLocation}
              title="Use my current location"
              className="hidden items-center gap-2 rounded-full bg-[#e9efe6] px-3 py-2 text-[11px] font-semibold text-[#455846] transition hover:bg-[#dfeadb] lg:flex"
            >
              <FiMapPin className="text-green-800" size={13} />
              Deliver to {locationLabel}
            </button>
          )}
          {user && (
            <Link
              href="/wishlist"
              aria-label="Saved products"
              className="relative hidden h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-[#dfeadb] hover:text-green-800 sm:flex"
            >
              <FiHeart size={15} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}
          {user && (
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative hidden h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-[#dfeadb] hover:text-green-800 sm:flex"
            >
              <FiShoppingCart size={15} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-700 px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard/profile"
              aria-label="Go to profile"
              title="Profile"
            className={`flex items-center gap-2 rounded-full border border-green-200 bg-[#dfeadb] text-xs font-bold text-green-800 transition hover:bg-[#d3e2cf] ${
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
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/register"
                className="rounded-md px-3 py-2 text-xs font-bold text-green-800 transition hover:bg-[#dfeadb]"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-[#08743a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#075f31]"
              >
                Login
              </Link>
            </div>
          )}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe7dc] text-gray-700 transition hover:bg-[#dfeadb] hover:text-green-800 md:hidden"
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="w-full rounded-2xl border border-[#dfe7dc] bg-white p-3 shadow-lg md:hidden">
            <nav className="grid gap-1 text-sm font-semibold text-slate-700">
              {variant === "storefront" && (
                <button
                  type="button"
                  onClick={requestLocation}
                  title="Use my current location"
                  className="mb-1 flex items-center gap-2 rounded-xl bg-[#e9efe6] px-3 py-2 text-left text-xs text-[#455846] transition hover:bg-[#dfeadb]"
                >
                  <FiMapPin className="text-green-800" size={14} />
                  Deliver to {locationLabel}
                </button>
              )}
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-3 py-2 transition ${
                    isActive(item.href)
                      ? "bg-green-50 text-green-700"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2 transition hover:bg-slate-50"
                  >
                    User Dashboard
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-slate-50"
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1.5 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-slate-50"
                  >
                    Saved Items
                    {wishlistCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2 transition hover:bg-slate-50"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-green-600 px-3 py-2 text-center text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-green-100 px-3 py-2 text-center text-green-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
