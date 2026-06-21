"use client";

import { FormEvent, useState } from "react";
import { FiLock } from "react-icons/fi";
import { updatePasswordApi } from "@/lib/api/auth";

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await updatePasswordApi({
        currentPassword,
        newPassword,
      });

      if (!response.success) {
        setError(response.message || "Password update failed");
        return;
      }

      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong while updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#10263a] text-white">
          <FiLock size={20} />
        </span>
        <div>
          <h1 className="text-xl font-black text-[#10263a]">Password</h1>
          <p className="text-sm text-gray-500">Change your account password.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-[#10263a]">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-md border border-green-100 px-4 py-3 text-sm text-[#10263a] outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[#10263a]">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-md border border-green-100 px-4 py-3 text-sm text-[#10263a] outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[#10263a]">
            Confirm password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-md border border-green-100 px-4 py-3 text-sm text-[#10263a] outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-100 px-3 py-2 text-sm font-bold text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-md bg-green-100 px-3 py-2 text-sm font-bold text-green-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#10263a] px-5 py-3 font-bold text-white transition hover:bg-[#193b58] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiLock size={18} />
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
