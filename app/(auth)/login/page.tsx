"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="h-[100dvh] bg-white">
      <section className="mx-auto flex h-full overflow-hidden bg-white shadow-sm">
        <div className="relative hidden h-full w-[52%] lg:block">
          <Image src="/login.png" alt="Fresh vegetables" fill priority className="rounded-r-[70px] object-cover" />
        </div>

        <div className="flex w-full items-center justify-center px-6 py-8 lg:w-[48%] lg:px-10">
          <div className="w-full max-w-[460px]">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-green-700">FreshCart</h1>

              <div className="mt-5 flex justify-center">
                <Image src="/logo.png" alt="FreshCart Logo" width={90} height={60} className="object-contain" />
              </div>
            </div>

            <div className="rounded-[36px] bg-[#c3d2c3] px-8 py-10 shadow-md md:px-10">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-black">Welcome Back</h2>
                <p className="mt-1 text-sm text-gray-600">Login to access your fresh groceries</p>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-800">Password</label>
                    <a href="#" className="text-sm font-medium text-green-700">
                      Forgot password?
                    </a>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4" />
                  Remember Me
                </label>

                <button type="submit" className="w-full rounded-md bg-green-500 py-3 font-bold text-white transition hover:bg-green-600">
                  Sign In
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-700">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-bold text-green-700">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}