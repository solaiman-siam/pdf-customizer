"use client";

import Image from "next/image";
import { images } from "@/lib/imageProvider";
import Link from "next/link";

interface HomePageProps {
  onApply: (mainServiceId?: string, categoryId?: string) => void;
  onLogout?: () => void;
  userEmail?: string;
}

export default function HomePage({ onApply, onLogout, userEmail }: HomePageProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden text-white font-sans">
      {/* Full Hero Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb18f1563?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        {/* Dark Gradient Overlay for optimal contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-900/75 to-slate-950/95 backdrop-blur-[1px]" />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation with Top Right Corner Actions */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        {/* Left: Ministry Branding */}
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-xl bg-white/95 p-1.5 flex items-center justify-center shadow-lg border border-white/20">
            <Image
              src={images.OmanLogo}
              alt="Sultanate of Oman Coat of Arms"
              width={42}
              height={42}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
              Sultanate of Oman
            </div>
            <div className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
              Foreign Ministry
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              Document Attestation & Legalization
            </div>
          </div>
        </div>

        {/* Right: Top Right Corner Actions (User Email + Logout + Apply Button) */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-1.5 text-xs text-slate-200 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-medium max-w-[160px] truncate">{userEmail}</span>
            </div>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
            >
              <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          )}

          <button
            onClick={() => onApply()}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Apply Now</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
         
        </div>
      </header>

      {/* Center Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 sm:px-8 py-12 sm:py-16 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8 my-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-400/30 px-4 py-1.5 text-xs font-bold text-teal-300 backdrop-blur-md shadow-sm">
          <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping"></span>
          Official e-Attestation Portal 2026
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl">
          Fast & Verified Document Attestation and Legalization
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          Authenticate civil certificates, degree credentials, commercial agreements, and origin documents
          with official digital seals and instant QR code verification.
        </p>

        {/* Primary Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <Link href={'/pdf'}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 px-8 py-4 text-base sm:text-lg font-extrabold text-slate-950 shadow-2xl shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Pdf Gallary</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Feature Highlights Pill Row */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl border-t border-white/10">
          <div className="flex items-center justify-center gap-2.5 rounded-xl bg-white/5 border border-white/10 py-3 px-4 backdrop-blur-md">
            <div className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-200">16-Digit eVerify QR</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 rounded-xl bg-white/5 border border-white/10 py-3 px-4 backdrop-blur-md">
            <div className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-200">Instant PDF Download</span>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2.5 rounded-xl bg-white/5 border border-white/10 py-3 px-4 backdrop-blur-md">
            <div className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-200">All Branches Supported</span>
          </div>
        </div>
      </main>

     
    </div>
  );
}
