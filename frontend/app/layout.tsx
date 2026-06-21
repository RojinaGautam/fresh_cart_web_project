import type { Metadata } from "next";
import { AuthProvider } from "../lib/contexts/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreshCart",
  description: "FreshCart grocery shopping dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
