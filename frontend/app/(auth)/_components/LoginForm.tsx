"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { loginAction } from "../../../lib/actions/auth-actions";
import { setTokenCookie, storeUserData } from "../../../lib/cookies";
import { loginSchema } from "./schema";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    const validatedData = loginSchema.safeParse({
      email,
      password,
    });

    if (!validatedData.success) {
      setErrorMessage(validatedData.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);

      const response = await loginAction({
        email,
        password,
      });

      if (!response.success) {
        setErrorMessage(response.message || "Login failed");
        return;
      }

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token) {
        setErrorMessage("Token not found from backend response");
        return;
      }

      if (!user) {
        setErrorMessage("User data not found from backend response");
        return;
      }

      await setTokenCookie(token);
      await storeUserData(user);

      router.push("/dashboard");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[100dvh] bg-white">
      <section className="mx-auto flex h-full overflow-hidden bg-white">
        {/* LEFT IMAGE SIDE */}
        <div className="relative hidden h-full w-[52%] lg:block">
          <Image
            src="/login.png"
            alt="Fresh vegetables"
            fill
            priority
            className="rounded-r-[70px] object-cover"
          />
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="flex w-full items-center justify-center px-6 py-8 lg:w-[48%] lg:px-10">
          <div className="w-full max-w-[500px]">
            {/* LOGO */}
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

            <div className="rounded-[36px] bg-[#c3d2c3] px-8 py-10 shadow-md md:px-10">
              <div className="mb-7 text-center">
                <h2 className="text-2xl font-bold text-black">Welcome Back</h2>

                <p className="mt-1 text-sm text-gray-600">
                  Login to access your fresh groceries
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#10263a]">
                    Email Address
                  </label>

                  <div className="relative">
                    <FiMail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-md border border-gray-200 bg-white px-10 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-bold text-[#10263a]">
                      Password
                    </label>

                    <Link
                      href="#"
                      className="text-xs font-semibold text-green-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <FiLock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className="w-full rounded-md border border-gray-200 bg-white px-10 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-green-600"
                  />

                  <label htmlFor="remember" className="text-sm text-gray-700">
                    Remember Me
                  </label>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <p className="rounded-md bg-red-100 px-3 py-2 text-center text-sm font-medium text-red-700">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-green-500 py-3 font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-gray-700">
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