"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7f2] px-6">
      <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase text-red-600">Admin Error</p>
        <h1 className="mt-2 text-2xl font-bold text-[#17251d]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {error.message || "Unable to load the admin page."}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-[#079b3b] px-4 py-2 text-sm font-bold text-white hover:bg-[#087f35]"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
