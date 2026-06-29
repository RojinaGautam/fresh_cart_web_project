import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7f2] px-6">
      <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase text-green-700">FreshCart</p>
        <h1 className="mt-2 text-2xl font-bold text-[#17251d]">
          Admin page not found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          This admin route does not exist.
        </p>
        <Link
          href="/admin"
          className="mt-5 inline-flex rounded-md bg-[#079b3b] px-4 py-2 text-sm font-bold text-white hover:bg-[#087f35]"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
