"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { images } from "@/lib/imageProvider";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------
// 🔐 YOUR SECRET CREDENTIALS
// Update these values to your preferred secret email and password.
// Anyone who enters these exact credentials will be granted access.
// ----------------------------------------------------------------------
export const SECRET_CREDENTIALS = {
  email: "admin@oman.gov.om",
  password: "adminPassword123",
};

export type LoginFormData = {
  email: string;
  password: string;
};

interface LoginPageProps {
  onLogin?: (data: LoginFormData) => void;
  onBack?: () => void;
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      // Simulate authentication check delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const inputEmail = data.email.trim().toLowerCase();
      const secretEmail = SECRET_CREDENTIALS.email.trim().toLowerCase();
      const isEmailValid = inputEmail === secretEmail;
      const isPasswordValid = data.password === SECRET_CREDENTIALS.password;

      // Reject if either secret email or password does not match
      if (!isEmailValid || !isPasswordValid) {
        setServerError("Invalid secret email or password. Access denied.");
        return;
      }

      // Store authenticated session
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "userAuth",
          JSON.stringify({
            email: data.email.trim(),
            loggedInAt: new Date().toISOString(),
          })
        );
      }

      if (onLogin) {
        onLogin(data);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setServerError("An unexpected error occurred during login. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
      {/* High Quality Background Image with Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb18f1563?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        {/* Subtle dark gradient overlay for optimal readability */}
        <div className="absolute inset-0 bg-linear-to-tr from-slate-950/90 via-slate-900/80 to-slate-950/85 backdrop-blur-[2px]" />
      </div>

      {/* Decorative ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button (Top Left) */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white border border-white/10 transition-all shadow-lg cursor-pointer"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Back to Portal</span>
        </button>
      )}

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/15 bg-white/95 p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all">
          {/* Ministry Header & Logo */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-md border border-slate-100">
              <Image
                src={images.OmanLogo}
                alt="Sultanate of Oman Emblem"
                width={52}
                height={52}
                className="object-contain"
                priority
              />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-700">
                Sultanate of Oman
              </span>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Foreign Ministry Portal
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Sign in to access document attestation and legalization services
              </p>
            </div>
          </div>

          {/* Server / API Error Message */}
          {serverError && (
            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-3 text-center text-xs font-semibold text-red-700 animate-fade-in">
              {serverError}
            </div>
          )}

          {/* Form with React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <input
                  id="login-email"
                  type="email"
                  placeholder="applicant@example.com"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full rounded-xl border bg-slate-50/60 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-600 pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password reset link will be sent to your registered email.")}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full rounded-xl border bg-slate-50/60 py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-600 pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-linear-to-r from-teal-600 to-teal-700 py-3 px-4 text-center text-sm font-bold text-white shadow-lg shadow-teal-700/25 hover:from-teal-500 hover:to-teal-600 hover:shadow-xl active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Notice */}
          <div className="mt-8 border-t border-slate-100 pt-4 text-center text-[11px] text-slate-400">
            Protected by Sultanate of Oman National Authentication Service
          </div>
        </div>
      </div>
    </div>
  );
}