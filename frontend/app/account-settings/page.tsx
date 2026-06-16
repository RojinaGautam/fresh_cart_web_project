"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FiCamera, FiLock, FiSave } from "react-icons/fi";
import AccountShell, { getProfileImageUrl } from "../_components/AccountShell";
import ProtectedRoute from "../_components/ProtectedRoute";
import {
  FreshCartUser,
  updatePasswordApi,
  updateProfileApi,
} from "../../lib/api/auth";
import { useAuth } from "../../lib/context/AuthContext";

function ProfileSettingsForm({ user }: { user: FreshCartUser }) {
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(getProfileImageUrl(user.profileImage));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (phoneNumber.trim().length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("phoneNumber", phoneNumber.trim());

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      setLoading(true);
      const response = await updateProfileApi(formData);

      if (!response.success) {
        setError(response.message || "Profile update failed");
        return;
      }

      setUser(response.data);
      setProfileImage(null);
      setMessage("Profile updated successfully");
    } catch {
      setError("Something went wrong while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-700">
          <FiCamera size={20} />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#10263a]">
            Profile settings
          </h2>
          <p className="text-sm text-gray-500">
            Update your FreshCart account details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-green-100 text-3xl font-black text-green-700">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              user.fullName.charAt(0).toUpperCase()
            )}
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-green-600 px-4 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50">
            <FiCamera size={17} />
            Choose image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[#10263a]">
            Full name
          </label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-md border border-green-100 px-4 py-3 text-sm text-[#10263a] outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[#10263a]">
            Phone number
          </label>
          <input
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
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
          className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiSave size={18} />
          {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}

function PasswordSettingsForm() {
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
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#10263a] text-white">
          <FiLock size={20} />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#10263a]">Password</h2>
          <p className="text-sm text-gray-500">
            Change your account password.
          </p>
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

export default function AccountSettingsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <AccountShell>
        {user && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <ProfileSettingsForm key={`${user.id}-${user.updatedAt}`} user={user} />
            <PasswordSettingsForm />
          </div>
        )}
      </AccountShell>
    </ProtectedRoute>
  );
}
