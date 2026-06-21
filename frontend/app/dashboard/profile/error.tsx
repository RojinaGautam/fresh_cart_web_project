"use client";

export default function ProfileError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-lg bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-bold text-red-700">Unable to load profile.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white"
      >
        Try again
      </button>
    </div>
  );
}
