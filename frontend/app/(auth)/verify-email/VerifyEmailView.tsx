"use client";

import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle, FiHash, FiMail } from "react-icons/fi";
import { useVerifyEmailViewModel } from "./useVerifyEmailViewModel";

// View: purely renders state from the ViewModel, no data-fetching logic of its own.
export default function VerifyEmailView({ initialEmail }: { initialEmail: string }) {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    loading,
    resending,
    errorMessage,
    resendMessage,
    verified,
    handleSubmit,
    handleResend,
  } = useVerifyEmailViewModel(initialEmail);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-100 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="FreshCart Logo"
            width={160}
            height={98}
            priority
            className="object-contain"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl">
          {verified ? (
            <div className="text-center">
              <FiCheckCircle className="mx-auto text-emerald-600" size={40} />
              <h2 className="mt-4 text-xl font-semibold text-slate-950">
                Email Verified
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Your email has been verified. You can now log in.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 py-3 font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  FreshCart Access
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  Verify Your Email
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Enter the 6-digit code we sent to your email.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Verification Code
                  </label>
                  <div className="relative">
                    <FiHash
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="123456"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-center text-lg font-bold tracking-[0.4em] text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">
                    {errorMessage}
                  </p>
                )}

                {resendMessage && (
                  <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-700">
                    {resendMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full text-center text-sm font-semibold text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm font-medium text-slate-600">
                Already verified?{" "}
                <Link href="/login" className="font-semibold text-emerald-700">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
