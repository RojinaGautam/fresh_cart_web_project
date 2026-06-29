"use client";

import { ReactNode } from "react";
import AdminRoute from "../_components/AdminRoute";
import { useAuth } from "../../lib/contexts/AuthContext";
import Footer from "./_components/Footer";
import Header from "./_components/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#f4f6f2] text-slate-950">
        <div className="flex min-w-0 flex-col">
          <Header user={user} onLogout={() => logout("/")} />
          <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 md:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </AdminRoute>
  );
}
