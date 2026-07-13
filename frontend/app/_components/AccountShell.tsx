"use client";
import {
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../lib/contexts/AuthContext";
import Footer from "./Footer";
import Navbar, { Avatar, getProfileImageUrl } from "./Navbar";

export { Avatar, getProfileImageUrl };

export default function AccountShell({
  children,
  variant = "account",
}: {
  children: React.ReactNode;
  variant?: "account" | "storefront";
}) {
  const { logout, user } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout("/");
  };

  return (
    <main className="min-h-screen bg-[#eef2ea] text-[#182d1f]">
      <Navbar user={user} variant={variant} />

      {variant === "account" ? (
        <section className="mx-auto w-full max-w-[1500px] px-5 py-8 md:px-8 lg:py-10">
          {children}
          <div className="mt-8 flex justify-center border-t border-[#d8e2d4] pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-100 bg-white px-5 py-3 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-[1500px] px-5 py-5 md:px-8">
          {children}
        </section>
      )}

      <Footer wide />
    </main>
  );
}
