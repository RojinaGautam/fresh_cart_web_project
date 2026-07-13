"use client";

import { ReactNode } from "react";
import AdminRoute from "../_components/AdminRoute";
import { useAuth } from "../../lib/contexts/AuthContext";
import Header, { AdminSidebar } from "./_components/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#eef2ea] text-slate-950">
        <div className="flex min-h-screen">
          <AdminSidebar user={user} onLogout={() => logout("/")} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="w-full flex-1 px-4 py-6 md:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
