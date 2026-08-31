"use client";

import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { ServiceRequest, branches, applyingFromOptions } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { submitPdf } from "../services/pdfApi";
import { IPdf } from "../types/pdfType";
import toast from "react-hot-toast";

export type ApplicationFormData = {
  applicantName: string;
  email: string;
  phoneNumber: string;
  branch: string;
  applyingFrom: string;
  taxRegistrationNumber?: string;
  eVerifyNo: string;
  verifyBy: string;
  verifyAt: string;
  dateOfAttestation: string;
  approverName: string;
  documentName?: string;
  paymentId: string;
  totalPayment: string;
  transactionDate: string;
  originalPdf?: FileList;
  documents?: FileList;
};

type ApplicationFormProps = {
  request: ServiceRequest;
  onBack: () => void;
  onSubmit: (data: ApplicationFormData) => void;
  defaultValues?: Partial<ApplicationFormData>;
};

export default function ApplicationForm({
  request,
  onBack,
  onSubmit,
  defaultValues,
}: ApplicationFormProps) {
  const calculatedTotal = `${(request.govFee + request.serviceFee + request.vatAmount).toFixed(2)} OMR`;
  const defaultTxDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    defaultValues: defaultValues ?? {
      applicantName: "",
      email: "",
      phoneNumber: "",
      branch: "",
      applyingFrom: "",
      taxRegistrationNumber: "",
      eVerifyNo: "",
      verifyBy: "Foreign Ministry - Oman",
      verifyAt: "",
      dateOfAttestation: "",
      approverName: "",
      documentName: request.name,
      paymentId: "",
      totalPayment: calculatedTotal,
      transactionDate: defaultTxDate,
    },
  });

  const watchedOriginalFiles = watch("originalPdf");
  const originalFileList =
    watchedOriginalFiles && watchedOriginalFiles.length > 0
      ? Array.from(watchedOriginalFiles)
      : [];

  const { mutate, isPending } = useMutation({
    mutationFn: (data: IPdf) => submitPdf(data),
    onSuccess: (data) => {
      toast.success("Pdf created successfully");
      console.log("Mutation Success Response:", data);
    },
    onError: (err) => {
      toast.error("Failed to create pdf");
      console.error("Mutation Error:", err);
    },
  });

  const handleFormSubmit = (data: ApplicationFormData) => {
    const fullPayload: IPdf = {
      ...data,
      documentName: data.documentName || request.name,
      paymentId: data.paymentId || "",
      totalPayment: data.totalPayment || calculatedTotal,
      transactionDate: data.transactionDate || defaultTxDate,
      taxRegistrationNumber: data.taxRegistrationNumber || "",
      originalPdf: data.originalPdf,
    };

    console.log("=== FORM SUBMISSION ALL DATA ===");
    console.log(fullPayload);
    console.log("Original PDF File:", fullPayload.originalPdf ? Array.from(fullPayload.originalPdf).map(f => f.name) : "None");
    console.log("================================");

    onSubmit(data);
  };

  const getInputClass = (hasError?: boolean) =>
    `w-full rounded-xl border bg-slate-50/70 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15"
        : "border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
    }`;

  const getSelectClass = (hasError?: boolean) =>
    `w-full appearance-none rounded-xl border bg-slate-50/70 py-2.5 pl-3.5 pr-10 text-sm font-medium text-slate-900 hover:bg-slate-50 focus:bg-white focus:outline-none transition-all cursor-pointer ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15"
        : "border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
    }`;

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white shadow-md overflow-hidden font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full">
            Step 2 of 4 • Form
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
            {request.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Complete the applicant details, payment transaction, and attestation verification data below.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs text-slate-400 font-medium">Attestation Fee</span>
          <div className="text-lg font-black text-teal-400">
            {(request.govFee + request.serviceFee + request.vatAmount).toFixed(2)} OMR
          </div>
        </div>
      </div>

      <form className="p-6 sm:p-8 space-y-8" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Section 1: Applicant Details */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
            <div className="h-7 w-7 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Applicant & Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Applicant Full Name" required error={errors.applicantName?.message}>
              <input
                type="text"
                placeholder="e.g. SULTAN AL-HILAL"
                className={getInputClass(!!errors.applicantName)}
                {...register("applicantName", {
                  required: "Applicant name is required",
                  minLength: {
                    value: 2,
                    message: "Applicant name must be at least 2 characters",
                  },
                })}
              />
            </Field>

            <Field label="Email Address" required error={errors.email?.message}>
              <input
                type="email"
                placeholder="applicant@example.com"
                className={getInputClass(!!errors.email)}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </Field>

            <Field label="Phone Number" required error={errors.phoneNumber?.message}>
              <input
                type="tel"
                placeholder="+968 9123 4567"
                className={getInputClass(!!errors.phoneNumber)}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+0-9\s-]{7,15}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
              />
            </Field>

            <Field label="Processing Branch" required error={errors.branch?.message}>
              <div className="relative">
                <select
                  className={getSelectClass(!!errors.branch)}
                  defaultValue=""
                  {...register("branch", {
                    required: "Please select a branch",
                  })}
                >
                  <option value="" disabled>
                    Select Ministry Branch...
                  </option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </Field>

            <Field label="Applying From (Country)" required error={errors.applyingFrom?.message}>
              <div className="relative">
                <select
                  className={getSelectClass(!!errors.applyingFrom)}
                  defaultValue=""
                  {...register("applyingFrom", {
                    required: "Please select where you are applying from",
                  })}
                >
                  <option value="" disabled>
                    Select Origin Country...
                  </option>
                  {applyingFromOptions.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </Field>

            <Field label="Tax Registration Number" error={errors.taxRegistrationNumber?.message}>
              <input
                type="text"
                placeholder="Optional TRN (e.g. OM-1234567)"
                className={getInputClass(!!errors.taxRegistrationNumber)}
                {...register("taxRegistrationNumber")}
              />
            </Field>
          </div>
        </div>

        {/* Section 2: Transaction & Payment Details */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
            <div className="h-7 w-7 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Transaction & Payment Details
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Payment ID" required error={errors.paymentId?.message}>
              <input
                type="text"
                placeholder="e.g. 202623821432105"
                className={getInputClass(!!errors.paymentId)}
                {...register("paymentId", { required: "Payment ID is required" })}
              />
            </Field>

            <Field label="Total Payment" required error={errors.totalPayment?.message}>
              <input
                type="text"
                placeholder="e.g. OMR 20.50"
                className={getInputClass(!!errors.totalPayment)}
                {...register("totalPayment", { required: "Total payment is required" })}
              />
            </Field>

            <Field label="Transaction Date" required error={errors.transactionDate?.message}>
              <input
                type="text"
                placeholder="e.g. 26 Aug 2026"
                className={getInputClass(!!errors.transactionDate)}
                {...register("transactionDate", { required: "Transaction date is required" })}
              />
            </Field>
          </div>
        </div>

        {/* Section 3: Attestation & Verification Data */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
            <div className="h-7 w-7 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Official Attestation Sticker Metadata
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="eVerify No (16-Digit Code)" required error={errors.eVerifyNo?.message}>
              <input
                type="text"
                placeholder="e.g. 2026110023419082"
                className={getInputClass(!!errors.eVerifyNo)}
                {...register("eVerifyNo", { required: "eVerify number is required" })}
              />
            </Field>

            <Field label="Verify By (Authority)" required error={errors.verifyBy?.message}>
              <input
                type="text"
                placeholder="e.g. Foreign Ministry - Oman"
                className={getInputClass(!!errors.verifyBy)}
                {...register("verifyBy", { required: "Verifier authority name is required" })}
              />
            </Field>

            <Field label="Verify At (Department / Location)" required error={errors.verifyAt?.message}>
              <input
                type="text"
                placeholder="e.g. Consular Department - Muscat"
                className={getInputClass(!!errors.verifyAt)}
                {...register("verifyAt", { required: "Verification location is required" })}
              />
            </Field>

            <Field label="Date & Time of Attestation" required error={errors.dateOfAttestation?.message}>
              <input
                type="datetime-local"
                className={getInputClass(!!errors.dateOfAttestation)}
                {...register("dateOfAttestation", { required: "Date of attestation is required" })}
              />
            </Field>

            <Field label="Approver / Officer Name" required error={errors.approverName?.message}>
              <input
                type="text"
                placeholder="e.g. Ahmed Al-Balushi"
                className={getInputClass(!!errors.approverName)}
                {...register("approverName", { required: "Approver name is required" })}
              />
            </Field>
          </div>
        </div>

        {/* Section 4: Original Document Upload */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
            <div className="h-7 w-7 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Original Document Upload
            </h3>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 sm:p-8 text-center hover:border-teal-500 hover:bg-teal-50/20 transition-all">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-800 mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            <p className="text-sm font-bold text-slate-900">
              Upload Original Document (PDF or Images)
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Upload the original certificate/document. Vertical A4 portrait recommended. Maximum file size: 5MB.
            </p>

            <div className="mt-4 flex flex-col items-center gap-3">
              <label
                htmlFor="original-pdf-upload"
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Browse Original File</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </label>
              <input
                id="original-pdf-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                {...register("originalPdf", {
                  required: "Please upload your original document",
                  validate: {
                    maxSize: (files?: FileList) => {
                      if (!files || files.length === 0) return true;
                      for (let i = 0; i < files.length; i++) {
                        if (files[i].size > 5 * 1024 * 1024) {
                          return `File "${files[i].name}" exceeds 5MB limit`;
                        }
                      }
                      return true;
                    },
                  },
                })}
              />

              {originalFileList.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  {originalFileList.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800"
                    >
                      <span>📄 {f.name}</span>
                      <span className="text-[10px] text-teal-600">({(f.size / 1024).toFixed(0)} KB)</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {errors.originalPdf?.message && (
              <p className="mt-3 text-xs font-bold text-red-600">{errors.originalPdf.message}</p>
            )}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-300 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ← Back to Selection
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>Continue to Preview</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs font-semibold text-red-600 pl-1">{error}</p>}
    </div>
  );
}