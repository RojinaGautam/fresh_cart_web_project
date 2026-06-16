"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../../lib/context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5fbf3] px-6">
        <div className="rounded-lg bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-green-700">
            Loading FreshCart account...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
