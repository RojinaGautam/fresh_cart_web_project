"use client";

import { ReactNode, useState } from "react";
import AdminRoute from "../_components/AdminRoute";
import { useAuth } from "../../lib/contexts/AuthContext";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-100 text-slate-950 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar
          user={user}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={() => logout("/")}
        />
        <div className="flex min-w-0 flex-col">
          <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 md:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </AdminRoute>
  );
}
