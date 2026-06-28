import { ReactNode } from "react";

export default function StatusScreen({
  title,
  message,
}: {
  title: ReactNode;
  message?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7f2] px-6">
      <div className="rounded-md border border-gray-200 bg-white px-8 py-6 text-center shadow-sm">
        <p className="text-sm font-bold text-green-700">{title}</p>
        {message && <p className="mt-1 text-xs text-gray-500">{message}</p>}
      </div>
    </main>
  );
}
