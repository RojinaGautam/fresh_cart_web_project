import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="rounded-lg bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-black text-[#10263a]">Page not found</h1>
      <Link
        href="/dashboard"
        className="mt-4 inline-block text-sm font-bold text-green-700"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
