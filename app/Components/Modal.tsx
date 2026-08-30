"use client";

import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  maxWidth?: string;
  onClose?: () => void;
};

export default function Modal({
  children,
  maxWidth = "max-w-3xl",
  onClose,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full ${maxWidth} animate-fade-in-up rounded-2xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden my-8`}
      >
        {children}
      </div>
    </div>
  );
}