"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import { resolveImageUrl } from "../../../lib/resolveImageUrl";

type UploadResponse = {
  success: boolean;
  message?: string;
  data?: { path: string } | null;
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  uploadAction,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  uploadAction: (file: File) => Promise<UploadResponse>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError("");
    setUploading(true);

    const response = await uploadAction(file);

    setUploading(false);

    if (!response.success || !response.data) {
      setError(response.message || "Unable to upload image");
      return;
    }

    onChange(response.data.path);
  };

  return (
    <div>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="mt-1 flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
          {value ? (
            <Image
              src={resolveImageUrl(value)}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <FiImage className="text-slate-300" size={24} />
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiUploadCloud size={14} />
            {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
