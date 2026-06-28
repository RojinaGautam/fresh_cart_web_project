"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../../lib/contexts/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router, user?.role]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5fbf3] px-6">
        <div className="rounded-lg bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-green-700">
            Checking admin access...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") return null;

  return <>{children}</>;
}
