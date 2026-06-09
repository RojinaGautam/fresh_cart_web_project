"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerAction } from "../../../lib/actions/auth-actions";
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

      setSuccessMessage("Registration successful! Please login now.");

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[100dvh] bg-white">
      <section className="mx-auto flex h-full overflow-hidden bg-white">
        {/* LEFT FORM SIDE */}
        <div className="flex w-full items-center justify-center px-6 py-8 lg:w-[52%] lg:px-10">
          <div className="w-full max-w-[520px]">
            {/* LOGO */}
            <div className="mb-6 flex justify-center">
              <Image
                src="/logo.png"
                alt="FreshCart Logo"
                width={180}
                height={110}
                priority
                className="object-contain"
              />
            </div>

            <div className="rounded-[36px] bg-[#c3d2c3] px-8 py-8 shadow-md md:px-10">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-black">
                  Create Account
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Sign up to start fresh shopping today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#10263a]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#10263a]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#10263a]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9800000000"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#10263a]">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#10263a]">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <p className="rounded-md bg-red-100 px-3 py-2 text-center text-sm font-medium text-red-700">
                    {errorMessage}
                  </p>
                )}

                {/* Success Message */}
                {successMessage && (
                  <p className="rounded-md bg-green-100 px-3 py-2 text-center text-sm font-medium text-green-700">
                    {successMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-green-500 py-3 font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating account..." : "Sign up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-700">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-green-700">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SIDE */}
        <div className="relative hidden h-full w-[48%] lg:block">
          <Image
            src="/register.png"
            alt="Fresh vegetables"
            fill
            priority
            className="rounded-l-[70px] object-cover"
          />
        </div>
      </section>
    </main>
  );
}