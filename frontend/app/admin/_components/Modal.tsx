"use client";

import { ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      {children}
    </div>
  );
}
