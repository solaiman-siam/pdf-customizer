"use client";

import React from "react";
import { Toaster, resolveValue, toast, Toast } from "react-hot-toast";

type ToastTypeConfig = {
  label: string;
  subtext: string;
  borderColor: string;
  glowShadow: string;
  badgeBg: string;
  badgeRing: string;
  tagColor: string;
  glowColor: string;
  progressGradient: string;
  icon: React.ReactNode;
};

const getTypeConfig = (type: Toast["type"]): ToastTypeConfig => {
  switch (type) {
    case "success":
      return {
        label: "SUCCESS",
        subtext: "Foreign Ministry Portal",
        borderColor: "border-teal-500/35 hover:border-teal-400/60",
        glowShadow: "shadow-[0_14px_40px_-8px_rgba(20,184,166,0.3)]",
        badgeBg: "bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 text-slate-950",
        badgeRing: "ring-2 ring-teal-400/25",
        tagColor: "text-teal-300 bg-teal-500/15 border-teal-500/30",
        glowColor: "bg-teal-500/20",
        progressGradient: "from-teal-400 to-emerald-500",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ),
      };

    case "error":
      return {
        label: "ATTENTION",
        subtext: "System Alert",
        borderColor: "border-rose-500/35 hover:border-rose-400/60",
        glowShadow: "shadow-[0_14px_40px_-8px_rgba(244,63,94,0.3)]",
        badgeBg: "bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white",
        badgeRing: "ring-2 ring-rose-400/25",
        tagColor: "text-rose-300 bg-rose-500/15 border-rose-500/30",
        glowColor: "bg-rose-500/20",
        progressGradient: "from-rose-500 to-red-600",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        ),
      };

    case "loading":
      return {
        label: "PROCESSING",
        subtext: "Foreign Ministry Service",
        borderColor: "border-cyan-500/35 hover:border-cyan-400/60",
        glowShadow: "shadow-[0_14px_40px_-8px_rgba(6,182,212,0.3)]",
        badgeBg: "bg-gradient-to-br from-cyan-500 via-teal-600 to-slate-900 text-cyan-200",
        badgeRing: "ring-2 ring-cyan-400/25",
        tagColor: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30",
        glowColor: "bg-cyan-500/20",
        progressGradient: "from-cyan-400 to-teal-400",
        icon: (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ),
      };

    default:
      return {
        label: "NOTICE",
        subtext: "Foreign Ministry Portal",
        borderColor: "border-amber-500/35 hover:border-amber-400/60",
        glowShadow: "shadow-[0_14px_40px_-8px_rgba(245,158,11,0.28)]",
        badgeBg: "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950",
        badgeRing: "ring-2 ring-amber-400/25",
        tagColor: "text-amber-300 bg-amber-500/15 border-amber-500/30",
        glowColor: "bg-amber-500/20",
        progressGradient: "from-amber-400 to-amber-600",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        ),
      };
  }
};

function PremiumToastCard({ toast: t }: { toast: Toast }) {
  const cfg = getTypeConfig(t.type);
  const duration = typeof t.duration === "number" && t.duration !== Infinity ? t.duration : 4000;

  return (
    <div
      role={t.ariaProps.role}
      aria-live={t.ariaProps["aria-live"]}
      className={`toast-card group relative w-full sm:w-[380px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ease-out shadow-2xl ${cfg.borderColor} ${cfg.glowShadow} ${
        t.visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
      }`}
      style={{
        ...t.style,
      }}
    >
      {/* Decorative ambient backlight glow behind badge */}
      <div
        className={`pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full ${cfg.glowColor} blur-2xl transition-all group-hover:scale-125`}
      />

      {/* Subtle top glossy light line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative p-3.5 sm:p-4">
        {/* Header row: Status pill + Portal label + Close button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shrink-0 ${cfg.tagColor}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {cfg.label}
            </span>
            <span className="text-[11px] font-medium text-slate-400 truncate">
              {cfg.subtext}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
            aria-label="Dismiss toast notification"
            className="h-6 w-6 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content row: Icon + Message */}
        <div className="flex items-start gap-3">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${cfg.badgeBg} ${cfg.badgeRing}`}
          >
            {cfg.icon}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="text-sm font-medium text-slate-100 leading-snug break-words">
              {resolveValue(t.message, t)}
            </div>
          </div>
        </div>
      </div>

      {/* Micro-Progress Bar indicating remaining duration (pauses on hover) */}
      {t.type !== "loading" && duration > 0 && (
        <div className="relative h-1 w-full bg-white/5 overflow-hidden">
          <div
            className={`toast-progress-bar h-full bg-gradient-to-r ${cfg.progressGradient}`}
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
      toastOptions={{
        duration: 4000,
        success: {
          duration: 4000,
        },
        error: {
          duration: 5000,
        },
      }}
    >
      {(t) => <PremiumToastCard toast={t} />}
    </Toaster>
  );
}
