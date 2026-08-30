"use client";

import React from "react";

type StepperProps = {
  currentStep: number;
};

const steps = [
  { id: 1, label: "Select Service" },
  { id: 2, label: "Enter User Details" },
  { id: 3, label: "Check and Pay" },
  { id: 4, label: "Confirmation" },
];

export default function Stepper({ currentStep }: StepperProps) {
  // Percentage for progress calculation
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)
  );

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 px-2">
      {/* Top Mobile/Summary Step Title */}
      <div className="flex sm:hidden items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-xs font-semibold text-slate-700">
          {steps.find((s) => s.id === currentStep)?.label}
        </span>
      </div>

      {/* Stepper Container */}
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isDone = stepNumber < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div className="relative flex flex-col sm:flex-row items-center gap-2 group z-10">
                <div
                  className={`flex items-center gap-2.5 rounded-full px-3.5 py-1.5 transition-all duration-300 ${
                    isActive
                      ? "bg-white border-2 border-teal-600 shadow-md ring-4 ring-teal-500/20 scale-105"
                      : isDone
                      ? "bg-teal-50 border border-teal-300 shadow-xs"
                      : "bg-white border border-gray-200 opacity-75"
                  }`}
                >
                  {/* Step Badge Circle */}
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-teal-700 text-white shadow-sm"
                        : isDone
                        ? "bg-teal-600 text-white animate-pop-in"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isDone ? (
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </span>

                  {/* Step Label */}
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap hidden sm:inline-block ${
                      isActive
                        ? "text-teal-950 font-bold"
                        : isDone
                        ? "text-teal-800"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Connecting Progress Line between steps */}
              {stepNumber !== steps.length && (
                <div className="relative flex-1 mx-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 transition-all duration-500 ease-out"
                    style={{
                      width: isDone ? "100%" : isActive ? "50%" : "0%",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}