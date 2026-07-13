"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { registerAction } from "../../../lib/actions/auth-action";
import { registerSchema } from "./schema";

export default function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validatedData = registerSchema.safeParse({
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });

    if (!validatedData.success) {
      setErrorMessage(validatedData.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);

      const response = await registerAction({
        fullName,
        email,
        phoneNumber,
        password,
      });

      if (!response.success) {
        setErrorMessage(response.message || "Registration failed");
        return;
      }

      setSuccessMessage(
        "Registration successful! Check your email for a verification code.",
      );

      const registeredEmail = email;

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(registeredEmail)}`);
      }, 1500);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-slate-100">
      <section className="mx-auto flex min-h-[100dvh] overflow-hidden bg-white">
        <div className="relative hidden min-h-[100dvh] w-[52%] lg:block">
          <Image
            src="/register.png"
            alt="Fresh groceries"
            fill
            priority
            className="rounded-r-[70px] object-cover"
          />
          <div className="absolute inset-0 rounded-r-[70px] bg-gradient-to-r from-emerald-950/20 to-transparent" />
        </div>

        <div className="flex w-full items-center justify-center px-6 py-8 lg:w-[48%] lg:px-10">
          <div className="w-full max-w-[500px]">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="FreshCart Logo"
                width={180}
                height={110}
                priority
                className="object-contain"
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl md:px-10">
              <div className="mb-7 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  FreshCart Access
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  Create Account
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Join FreshCart for faster checkout and fresher weekly picks
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

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
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                    />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9800000000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FiLock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">
                    {errorMessage}
                  </p>
                )}

                {successMessage && (
                  <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-700">
                    {successMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm font-medium text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-emerald-700">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
