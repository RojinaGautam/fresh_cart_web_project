"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiCheckCircle,
  FiChevronRight,
  FiCreditCard,
  FiEdit2,
  FiHome,
  FiPlus,
} from "react-icons/fi";
import { Avatar } from "@/app/_components/AccountShell";
import { useAuth } from "@/lib/contexts/AuthContext";

const formatDate = (date?: string) => {
  if (!date) return "March 12, 1994";

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
        {user && (
          <div className="space-y-5">
            <section className="rounded-md border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="relative h-24 w-24 shrink-0">
                    <Avatar
                      user={user}
                      className="h-24 w-24 text-3xl ring-4 ring-green-100"
                    />
                    <Link
                      href="/dashboard/profile/edit"
                      aria-label="Edit account"
                      className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white shadow-md ring-4 ring-white transition hover:bg-green-800"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-black text-[#17251c]">
                        {user.fullName}
                      </h1>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
                        <FiCheckCircle size={12} />
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-gray-500">
                      FreshCart Customer since {formatDate(user.createdAt)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black text-green-700">
                        Verified Account
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-black text-gray-600">
                        Eco Star Support
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-black text-gray-500">
                    Full Name
                  </label>
                  <div className="rounded bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                    {user.fullName}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-black text-gray-500">
                    Email Address
                  </label>
                  <div className="rounded bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-black text-gray-500">
                    Phone Number
                  </label>
                  <div className="rounded bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                    {user.phoneNumber}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-black text-gray-500">
                    Date of Birth
                  </label>
                  <div className="rounded bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                    March 12, 1994
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="rounded-md border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-[#17251c]">
                    Payment  Address
                  </h2>
                  <button
                    type="button"
                    className="text-xs font-black text-green-700"
                  >
                    Manage
                  </button>
                </div>

                <div className="mt-4 rounded-md border border-green-100 bg-green-50 p-4">
                  <div className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                      <FiHome size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-black text-[#17251c]">Home</p>
                      <p className="mt-1 text-xs font-medium leading-5 text-gray-500">
                        123 Highland Terrace, Apt 4B
                        <br />
                        Portland, OR 97202
                      </p>
                    </div>
                  </div>
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-3 text-xs font-black text-gray-600 transition hover:bg-gray-50">
                  <FiPlus size={14} />
                  Add New Address
                </button>
              </section>

              <section className="rounded-md border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-[#17251c]">
                    Payment Method
                  </h2>
                  <button
                    type="button"
                    className="text-xs font-black text-green-700"
                  >
                    Manage
                  </button>
                </div>

                <div className="mt-4 rounded-md border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-12 items-center justify-center rounded bg-[#111827] text-white">
                      <FiCreditCard size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-black text-[#17251c]">
                        Visa ending in 4242
                      </p>
                      <p className="text-xs font-medium text-gray-500">
                        Expires 08/27
                      </p>
                    </div>
                  </div>
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-3 text-xs font-black text-gray-600 transition hover:bg-gray-50">
                  <FiPlus size={14} />
                  Link New Card
                </button>
              </section>
            </div>

            <section className="rounded-md border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#17251c]">
                  Recent Order
                </h2>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-xs font-black text-green-700"
                >
                  View History
                  <FiChevronRight size={14} />
                </Link>
              </div>

              <div className="mt-4 flex flex-col gap-4 rounded-md border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-green-50">
                    <Image
                      src="/raspberries.png"
                      alt="Recent grocery order"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#17251c]">
                      Order #FC-2026-1184
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      Delivered on June 16, 2026
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-lg font-black text-green-700">$42.30</p>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-black text-green-700">
                    Delivered
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}
    </>
  );
}
