"use client";

import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  maxWidth?: string;
};

export default function Modal({ children, maxWidth = "max-w-3xl" }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-20 px-4 overflow-y-auto pb-10">
      <div className={`w-full ${maxWidth} rounded-lg bg-white shadow-xl overflow-hidden`}>
        {children}
      </div>
    </div>
  );
}