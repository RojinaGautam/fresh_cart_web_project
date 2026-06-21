"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FiCamera, FiSave } from "react-icons/fi";
import { getProfileImageUrl } from "@/app/_components/AccountShell";
import { FreshCartUser, updateProfileApi } from "@/lib/api/auth";
import { useAuth } from "@/lib/contexts/AuthContext";
import { updateProfileSchema } from "./schema";

export default function UpdateForm({ user }: { user: FreshCartUser }) {
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

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const parsedData = updateProfileSchema.safeParse({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
    });

    if (!parsedData.success) {
      setError(parsedData.error.issues[0].message);
      return;
    }

    const formData = new FormData();
    formData.append("fullName", parsedData.data.fullName);
    formData.append("phoneNumber", parsedData.data.phoneNumber);

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
          <h1 className="text-xl font-black text-[#10263a]">Profile settings</h1>
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
