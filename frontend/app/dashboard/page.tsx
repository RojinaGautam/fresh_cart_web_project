"use client";

import {
  FiClock,
  FiHeart,
  FiPackage,
  FiShoppingCart,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import AccountShell from "../_components/AccountShell";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useAuth } from "../../lib/context/AuthContext";

const quickStats = [
  { label: "Fresh orders", value: "12", icon: FiPackage, tone: "bg-green-100 text-green-700" },
  { label: "Saved items", value: "28", icon: FiHeart, tone: "bg-lime-100 text-lime-700" },
  { label: "Reviews", value: "7", icon: FiStar, tone: "bg-yellow-100 text-yellow-700" },
];

const recentOrders = [
  { name: "Organic Veggie Box", status: "Arriving today", amount: "$34.90" },
  { name: "Weekly Fruit Basket", status: "Delivered", amount: "$28.40" },
  { name: "Dairy Essentials", status: "Preparing", amount: "$18.25" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <AccountShell>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase text-green-700">
                  Good to see you
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#10263a]">
                  {user?.fullName}, your fresh cart is ready.
                </h2>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700">
                <FiShoppingCart size={18} />
                Start shopping
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {quickStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div key={stat.label} className="rounded-lg border border-green-100 p-4">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.tone}`}>
                      <Icon size={20} />
                    </span>
                    <p className="mt-4 text-2xl font-black text-[#10263a]">
                      {stat.value}
                    </p>
                    <p className="text-sm font-semibold text-gray-500">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <FiTruck size={20} />
              </span>
              <div>
                <h2 className="text-lg font-black text-[#10263a]">
                  Delivery window
                </h2>
                <p className="text-sm text-gray-500">Today, 4:00 PM - 6:00 PM</p>
              </div>
            </div>
            <div className="mt-6 rounded-lg bg-[#f5fbf3] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-green-700">
                <FiClock size={16} />
                Next order placeholder
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Saved checkout and live order tracking will appear here in the
                next shopping sprint.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-[#10263a]">Recent orders</h2>
          <div className="mt-4 grid gap-3">
            {recentOrders.map((order) => (
              <div
                key={order.name}
                className="flex flex-col gap-2 rounded-lg border border-green-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-[#10263a]">{order.name}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
                <p className="font-black text-green-700">{order.amount}</p>
              </div>
            ))}
          </div>
        </section>
      </AccountShell>
    </ProtectedRoute>
  );
}
