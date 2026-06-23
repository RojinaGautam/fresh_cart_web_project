"use client";

import { FormEvent, useState } from "react";
import { FiLock } from "react-icons/fi";
import { updatePasswordApi } from "@/lib/api/auth";

export default function PasswordForm() {
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
      const response = await updatePasswordApi({ currentPassword, newPassword });

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
    <section className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-green-100 text-green-700">
          <FiLock size={20} />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#17251c]">Update password</h2>
          <p className="text-sm text-gray-500">Keep your FreshCart account secure.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {[
          ["Current Password", currentPassword, setCurrentPassword],
          ["New Password", newPassword, setNewPassword],
          ["Confirm Password", confirmPassword, setConfirmPassword],
        ].map(([label, value, setter]) => (
          <div key={label as string}>
            <label className="mb-2 block text-xs font-black text-gray-600">
              {label as string}
            </label>
            <input
              type="password"
              value={value as string}
              onChange={(event) =>
                (setter as (value: string) => void)(event.target.value)
              }
              required
              className="w-full rounded-md border border-green-100 px-4 py-3 text-sm text-[#17251c] outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p>}
        {message && <p className="rounded-md bg-green-50 px-3 py-2 text-sm font-bold text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiLock size={17} />
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
