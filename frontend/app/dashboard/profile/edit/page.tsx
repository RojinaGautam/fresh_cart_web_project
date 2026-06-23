"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/lib/contexts/AuthContext";
import PasswordForm from "../_components/PasswordForm";
import UpdateForm from "../_components/UpdateForm";

export default function EditProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link
        href="/dashboard/profile"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-green-700"
      >
        <FiArrowLeft size={17} />
        Back to profile
      </Link>
      <div className="grid items-start gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UpdateForm user={user} />
        <PasswordForm />
      </div>
    </div>
  );
}
