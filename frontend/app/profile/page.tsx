"use client";

import { FiHeart, FiMail, FiPhone, FiShoppingBag, FiStar, FiUser, FiEdit2, FiSettings, FiLogOut } from "react-icons/fi";
import AccountShell from "../_components/AccountShell";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useAuth } from "../../lib/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { clearStoredAuth } from "@/lib/auth-storage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logout();
    clearStoredAuth();
    router.push("/login");
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  const profileImage = user?.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${user.profileImage}`
    : "/default-avatar.png";

  return (
    <ProtectedRoute>
      <AccountShell>
        {/* BANNER SECTION */}
        <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* PROFILE HEADER WITH AVATAR */}
        <div className="relative -mt-24 mb-8 px-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* AVATAR */}
            <div className="relative h-40 w-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex-shrink-0">
              <Image
                src={profileImage}
                alt={user?.fullName || "Profile"}
                fill
                className="object-cover"
              />
            </div>

            {/* USER INFO */}
            <div className="pb-2 flex-grow">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{user?.fullName}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">{user?.phoneNumber}</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
              <Link
                href="/profile/edit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
              >
                <FiEdit2 size={16} />
                Edit Profile
              </Link>
              <Link
                href="/account-settings"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium text-sm"
              >
                <FiSettings size={16} />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-6 lg:grid-cols-3 px-4">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            {/* INFO CARD */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#10263a] mb-4">Account Information</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-green-100 p-4">
                  <FiMail className="text-green-700 mt-1" size={18} />
                  <div className="flex-grow">
                    <p className="text-xs font-bold uppercase text-gray-400">Email</p>
                    <p className="font-medium text-[#10263a] break-all text-sm">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-green-100 p-4">
                  <FiPhone className="text-green-700 mt-1" size={18} />
                  <div className="flex-grow">
                    <p className="text-xs font-bold uppercase text-gray-400">Phone</p>
                    <p className="font-medium text-[#10263a] text-sm">{user?.phoneNumber}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-green-100 p-4">
                  <p className="text-xs font-bold uppercase text-gray-400">Member Since</p>
                  <p className="font-medium text-[#10263a] text-sm mt-1">{memberSince}</p>
                </div>

                <div className="pt-4 border-t">
                  <Link
                    href="/account-settings"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Account Settings →
                  </Link>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-medium text-sm disabled:opacity-50"
              >
                <FiLogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-2 space-y-6">
            {/* STATS CARDS */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 mb-3">
                  <FiShoppingBag className="text-green-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-1">Total Orders</p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 mb-3">
                  <FiHeart className="text-blue-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-1">Saved Products</p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-100 mb-3">
                  <FiStar className="text-yellow-600" size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-1">Reviews</p>
              </div>
            </div>

            {/* ACTIVITY SECTION */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#10263a] mb-4">FreshCart Activity</h2>
              <div className="mt-6 grid gap-4">
                <div className="flex items-start gap-4 rounded-lg bg-[#f5fbf3] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-green-700">
                    <FiHeart size={20} />
                  </span>
                  <div>
                    <p className="font-bold text-[#10263a]">Saved Products</p>
                    <p className="text-sm text-gray-600">Seasonal picks and pantry staples</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg bg-[#f5fbf3] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-green-700">
                    <FiShoppingBag size={20} />
                  </span>
                  <div>
                    <p className="font-bold text-[#10263a]">Order History</p>
                    <p className="text-sm text-gray-600">Upcoming and completed grocery runs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg bg-[#f5fbf3] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-green-700">
                    <FiStar size={20} />
                  </span>
                  <div>
                    <p className="font-bold text-[#10263a]">Reviews</p>
                    <p className="text-sm text-gray-600">Ratings for products you have tried</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccountShell>
    </ProtectedRoute>
  );
}
