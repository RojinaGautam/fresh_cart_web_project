"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiLock, FiMail, FiShield, FiUser } from "react-icons/fi";
import { loginAction } from "../../../lib/actions/auth-action";
import { useAuth } from "../../../lib/contexts/AuthContext";
import { loginSchema } from "./schema";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");

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

      if (loginMode === "admin" && user.role !== "admin") {
        setErrorMessage("This account does not have admin access");
        return;
      }

      login(token, user);

      router.push(user.role === "admin" ? "/admin" : "/");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-slate-100">
      <section className="mx-auto flex min-h-[100dvh] overflow-hidden bg-white">
        {/* LEFT IMAGE SIDE */}
        <div className="relative hidden min-h-[100dvh] w-[52%] lg:block">
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

            <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl md:px-10">
              <div className="mb-7 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                  FreshCart Access
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Choose your account type to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setLoginMode("user")}
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition active:scale-[0.98] ${
                      loginMode === "user"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    <FiUser size={15} />
                    Login as User
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("admin")}
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition active:scale-[0.98] ${
                      loginMode === "admin"
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    <FiShield size={15} />
                    Login as Admin
                  </button>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-black text-slate-800">
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

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-black text-slate-800">
                      Password
                    </label>

                    <Link
                      href="#"
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

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

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-green-600"
                  />

                  <label htmlFor="remember" className="text-sm font-medium text-slate-600">
                    Remember Me
                  </label>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-500 py-3 font-black text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading
                    ? "Signing in..."
                    : loginMode === "admin"
                      ? "Sign In as Admin"
                      : "Sign In as User"}
                </button>
              </form>

              <p className="mt-7 text-center text-sm font-medium text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-black text-emerald-700">
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
