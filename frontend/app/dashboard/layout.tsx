"use client";

import { usePathname } from "next/navigation";
import AccountShell from "../_components/AccountShell";
import ProtectedRoute from "../_components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const variant = pathname === "/dashboard" ? "storefront" : "account";

  return (
    <ProtectedRoute>
      <AccountShell variant={variant}>{children}</AccountShell>
    </ProtectedRoute>
  );
}
