export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="rounded-2xl bg-[#c3d2c3] px-12 py-10 text-center shadow-md">
        <h1 className="text-3xl font-bold text-green-700">
          Welcome to FreshCart Dashboard
        </h1>
        <p className="mt-3 text-gray-700">
          Login successful. You are now inside the dashboard.
        </p>
      </div>
    </main>
  );
}