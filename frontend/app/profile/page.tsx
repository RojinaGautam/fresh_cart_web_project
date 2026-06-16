"use client";

import { FiHeart, FiMail, FiPhone, FiShoppingBag, FiStar, FiUser } from "react-icons/fi";
import AccountShell from "../_components/AccountShell";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useAuth } from "../../lib/context/AuthContext";

const placeholders = [
  { label: "Saved products", detail: "Seasonal picks and pantry staples", icon: FiHeart },
  { label: "Order history", detail: "Upcoming and completed grocery runs", icon: FiShoppingBag },
  { label: "Reviews", detail: "Ratings for products you have tried", icon: FiStar },
];

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <AccountShell>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#10263a]">
              Profile details
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-green-100 p-4">
                <FiUser className="text-green-700" size={20} />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    Full name
                  </p>
                  <p className="font-bold text-[#10263a]">{user?.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-green-100 p-4">
                <FiMail className="text-green-700" size={20} />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    Email
                  </p>
                  <p className="font-bold text-[#10263a]">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-green-100 p-4">
                <FiPhone className="text-green-700" size={20} />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    Phone
                  </p>
                  <p className="font-bold text-[#10263a]">{user?.phoneNumber}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#10263a]">
              FreshCart activity
            </h2>
            <div className="mt-6 grid gap-4">
              {placeholders.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-lg bg-[#f5fbf3] p-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-green-700">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-black text-[#10263a]">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </AccountShell>
    </ProtectedRoute>
  );
}
