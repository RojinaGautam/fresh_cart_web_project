"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/lib/contexts/AuthContext";
import UpdateForm from "../_components/UpdateForm";

export default function EditProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/profile"
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-green-700"
      >
        <FiArrowLeft size={17} />
        Back to profile
      </Link>
      <UpdateForm user={user} />
    </div>
  );
}
