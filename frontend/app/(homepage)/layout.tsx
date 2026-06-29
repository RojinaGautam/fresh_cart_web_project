"use client";

import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";
import { useAuth } from "../../lib/contexts/AuthContext";

export default function HomepageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const publicUser = user?.role === "admin" ? null : user;

  return (
    <main className="min-h-screen bg-[#f5f6f4] text-[#182d1f]">
      <Navbar user={publicUser} variant="storefront" />
      <section className="mx-auto w-full max-w-[1500px] px-5 py-5 md:px-8">
        {children}
      </section>
      <Footer wide />
    </main>
  );
}
