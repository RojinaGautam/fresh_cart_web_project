"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import ProtectedRoute from "../../_components/ProtectedRoute";
import AccountShell from "../../_components/AccountShell";
import { updateProfileAction } from "@/lib/actions/auth-actions";
import { setStoredUser } from "@/lib/auth-storage";
import Image from "next/image";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser, loading, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    user?.profileImage
      ? user.profileImage.startsWith("http")
        ? user.profileImage
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${user.profileImage}`
      : "/default-avatar.png"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (loading) {
    return (
      <ProtectedRoute>
        <AccountShell>
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </AccountShell>
      </ProtectedRoute>
    );
  }

  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size must be less than 5MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage("Full name is required");
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage("Phone number is required");
      return;
    }

    if (phoneNumber.length < 10) {
      setErrorMessage("Phone number must be at least 10 digits");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phoneNumber", phoneNumber);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await updateProfileAction(formData);

      if (!response.success) {
        setErrorMessage(response.message || "Failed to update profile");
        return;
      }

      // Update context with new user data
      if (response.data) {
        setUser(response.data);
        setStoredUser(response.data);
        setSuccessMessage("Profile updated successfully!");
        
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AccountShell>
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4 px-4">
          <Link href="/profile" className="inline-flex">
            <FiArrowLeft size={24} className="text-gray-600 hover:text-gray-900" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        {/* FORM */}
        <div className="mx-auto max-w-2xl px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ERROR MESSAGE */}
            {errorMessage && (
              <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {successMessage && (
              <div className="rounded-lg bg-green-50 p-4 text-green-600 border border-green-200">
                {successMessage}
              </div>
            )}

            {/* PROFILE IMAGE SECTION */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* IMAGE PREVIEW */}
                <div className="flex-shrink-0">
                  <div className="relative h-32 w-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* UPLOAD BUTTON */}
                <div className="flex-grow flex flex-col justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium w-fit"
                  >
                    <FiUpload size={18} />
                    Upload Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or AVIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* PERSONAL INFO SECTION */}
            <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

              {/* FULL NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                  placeholder="Enter your full name"
                />
              </div>

              {/* PHONE NUMBER */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* EMAIL (READ-ONLY) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contact support to change your email
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/profile"
                className="flex-1 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </AccountShell>
    </ProtectedRoute>
  );
}
