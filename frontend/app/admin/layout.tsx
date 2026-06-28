"use client";

import { ReactNode } from "react";
import AdminRoute from "../_components/AdminRoute";
import { useAuth } from "../../lib/contexts/AuthContext";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();

  return (
    <AdminRoute>
      <div className="flex min-h-screen flex-col bg-[#f4f7f2]">
        <Header user={user} onLogout={() => logout("/")} />
        <main className="mx-auto grid w-full max-w-[1500px] flex-1 gap-5 px-5 py-6 md:grid-cols-[220px_minmax(0,1fr)] md:px-8">
          <Sidebar />
          {children}
        </main>
        <Footer />
      </div>
    </AdminRoute>
  );
}
