"use client";

import Link from "next/link";
import { FiHome, FiLogOut } from "react-icons/fi";
import Logo from "../../_components/Logo";
import { FreshCartUser } from "../../../lib/api/auth";

export default function Header({
  user,
  onLogout,
}: {
  user: FreshCartUser | null;
  onLogout: () => void;
}) {
  return (
    <header className="border-b border-green-100 bg-white">
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
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
            onClick={onLogout}
            className="flex items-center gap-2 rounded-md bg-[#079b3b] px-3 py-2 text-xs font-bold text-white hover:bg-[#087f35]"
          >
            <FiLogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
