"use client";

import { useEffect, useMemo, useState } from "react";
import { mainServices, ServiceCategory, ServiceRequest } from "@/lib/data";
import Stepper from "./Components/Stepper";
import ApplicationForm, { ApplicationFormData } from "./Components/ApplicationForm";
import Modal from "./Components/Modal";
import AttestedDocumentPage from "./Components/AttestedDocumentPage";
import { AttestationData } from "./Components/AttestationCertificate";
import { generateAttestationPdf } from "@/lib/pdfGenerator";
import { filesToDataUrls } from "@/lib/documentLoader";
import Image from "next/image";
import HomePage from "./Components/HomePage";
import LoginPage, { LoginFormData } from "./Components/LoginPage";
import OmaniRiel from "@/app/assets/images/omani-real.png";
import { submitPdf } from "./services/pdfApi";
import { IPdf } from "./types/pdfType";
import toast from "react-hot-toast";

type FlowStage = "home" | "picking" | "form" | "submitted";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [mainServiceId, setMainServiceId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData | null>(null);
  const [documentPreviewUrls, setDocumentPreviewUrls] = useState<string[]>([]);
  const [stage, setStage] = useState<FlowStage>("home");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Check saved authentication state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userAuth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setIsAuthenticated(true);
          setUserEmail(parsed.email);
          return;
        }
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
    setIsAuthenticated(false);
  }, []);

  function handleLoginSuccess(data: LoginFormData) {
    setIsAuthenticated(true);
    setUserEmail(data.email);
    setStage("home");
  }

  function handleLogout() {
    try {
      localStorage.removeItem("userAuth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setIsAuthenticated(false);
    setUserEmail("");
    setStage("home");
  }

  const mainService = useMemo(
    () => mainServices.find((s) => s.id === mainServiceId) ?? null,
    [mainServiceId]
  );

  const category: ServiceCategory | null = useMemo(
    () => mainService?.categories?.find((c) => c.id === categoryId) ?? null,
    [mainService, categoryId]
  );

  const currentStep = stage === "picking" ? 1 : stage === "form" ? 2 : 4;

  const attestationData: AttestationData | null = useMemo(() => {
    if (!formData || !selectedRequest) return null;

    let formattedDate = formData.dateOfAttestation || "";
    if (formattedDate && formattedDate.includes("T")) {
      formattedDate = formattedDate.replace("T", " ") + ":00";
    }

    return {
      eVerifyNo: formData.eVerifyNo,
      verifyBy: formData.verifyBy,
      verifyAt: formData.verifyAt,
      applicantName: formData.applicantName.toUpperCase(),
      documentName: selectedRequest.name,
      dateOfAttestation: formattedDate,
      approverName: formData.approverName,
      serviceName: selectedRequest.name,
      totalFee: (
        selectedRequest.govFee +
        selectedRequest.serviceFee +
        selectedRequest.vatAmount
      ).toFixed(2),
      taxRegistrationNumber: formData.taxRegistrationNumber,
    };
  }, [formData, selectedRequest]);

  function handleMainServiceChange(id: string) {
    setMainServiceId(id);
    setCategoryId("");
    setSelectedRequest(null);
  }

  function handleCategoryChange(id: string) {
    setCategoryId(id);
    setShowRequestModal(true);
  }

  function handleRequestSelect(req: ServiceRequest) {
    setSelectedRequest(req);
    setShowRequestModal(false);
    setShowFeeModal(true);
  }

  function handleProceed() {
    setShowFeeModal(false);
    setStage("form");
  }

  function handleCancelFee() {
    setShowFeeModal(false);
    setSelectedRequest(null);
    setShowRequestModal(true);
  }

  async function handleFormSubmit(data: ApplicationFormData) {
    setFormData(data);

    // Load preview from originalPdf (or fallback documents)
    const previewFiles: File[] = [];
    if (data.originalPdf && data.originalPdf.length > 0) {
      previewFiles.push(...Array.from(data.originalPdf));
    } else if (data.documents && data.documents.length > 0) {
      previewFiles.push(...Array.from(data.documents));
    }

    if (previewFiles.length > 0) {
      try {
        const urls = await filesToDataUrls(previewFiles as any);
        setDocumentPreviewUrls(urls);
      } catch (err) {
        console.error("Failed to load uploaded document preview:", err);
        setDocumentPreviewUrls([]);
      }
    } else {
      setDocumentPreviewUrls([]);
    }

    setStage("submitted");
  }

  async function handleDownloadPdf() {
    if (!attestationData) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      // 1. Generate the Attested PDF first to get the attested Blob
      const pageCount = documentPreviewUrls.length > 0 ? documentPreviewUrls.length : 1;
      const elementIds = Array.from(
        { length: pageCount },
        (_, i) => `attested-document-pdf-${i}`
      );

      const attestedFileName = `Oman_Attested_${attestationData.eVerifyNo}.pdf`;
      const attestedBlob = await generateAttestationPdf(
        elementIds,
        attestedFileName
      );

      const attestedPdfFile = new File(
        [attestedBlob],
        attestedFileName,
        { type: "application/pdf" }
      );

      // 2. Post both original upload and attested PDF to backend
      if (formData) {
        const payload: IPdf = {
          applicantName: formData.applicantName,
          applyingFrom: formData.applyingFrom,
          approverName: formData.approverName,
          branch: formData.branch,
          dateOfAttestation: formData.dateOfAttestation,
          eVerifyNo: formData.eVerifyNo,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          taxRegistrationNumber: formData.taxRegistrationNumber || "",
          verifyAt: formData.verifyAt,
          verifyBy: formData.verifyBy,
          documentName: formData.documentName || selectedRequest?.name || "Attestation Document",
          transactionDate: formData.transactionDate,
          totalPayment: formData.totalPayment,
          paymentId: formData.paymentId,
          originalPdf: formData.originalPdf, // User's uploaded original file
          documents: attestedPdfFile, // Generated official attested PDF file
        };

        console.log("=== SUBMITTING PDF TO BACKEND ===");
        console.log("Payload:", payload);
        await submitPdf(payload);
        toast.success("Document created & saved to database successfully!");
      }

      setDownloadSuccess(true);
      toast.success("Attested PDF downloaded successfully!");
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (err: any) {
      console.error("PDF generation or backend submit error:", err);
      toast.error(err?.message || "Failed to process PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  function handleApplyFromHome(selectedServiceId?: string, selectedCategoryId?: string) {
    if (selectedServiceId) {
      setMainServiceId(selectedServiceId);
    } else if (!mainServiceId) {
      setMainServiceId("foreign-ministry-oman");
    }

    if (selectedCategoryId) {
      setCategoryId(selectedCategoryId);
      setShowRequestModal(true);
    }

    setStage("picking");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBackToHome() {
    setStage("home");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // While checking auth on initial render
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Protected Page: show LoginPage if unauthenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  if (stage === "home") {
    return (
      <HomePage
        onApply={handleApplyFromHome}
        onLogout={handleLogout}
        userEmail={userEmail}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-200/70 p-4 md:p-8 text-black font-sans">
      {/* Top Application Flow Header */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-950 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>

        <h1 className="text-base sm:text-lg font-bold text-gray-800 text-center">
          {mainService?.name ?? "Foreign Ministry - Oman"}
        </h1>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            Step {currentStep} of 4
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-xs text-gray-500 hover:text-red-600 font-medium px-2 py-1 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      <Stepper currentStep={currentStep} />

      {stage === "picking" && (
        <div className="animate-fade-in-up mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Step 1 of 4
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Select Attestation Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose the Foreign Ministry or Diplomatic Embassy Mission and select your service category.
            </p>
          </div>

          {!mainService && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="main-service">
                Embassy / Ministry Service <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <select
                  id="main-service"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-10 text-sm font-medium text-slate-900 hover:bg-slate-50 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all cursor-pointer shadow-xs"
                  value={mainServiceId}
                  onChange={(e) => handleMainServiceChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select or search a service...
                  </option>
                  {mainServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {mainService && mainService.categories && (
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="category">
                Service Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-teal-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <select
                  id="category"
                  className="w-full appearance-none rounded-xl border border-teal-300 bg-teal-50/30 py-3 pl-10 pr-10 text-sm font-semibold text-slate-900 hover:bg-teal-50/60 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/15 transition-all cursor-pointer shadow-xs"
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select or search a Service Category in the list...
                  </option>
                  {mainService.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-teal-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {mainService && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="leading-relaxed">
                Make sure all pre-requisite attestation steps are completed before applying for Oman
                Embassy / Foreign Ministry Attestation.
              </p>
            </div>
          )}

          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-slate-900 p-3.5 text-left text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>How To Apply - Step-by-Step Guide</span>
            </div>
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {mainService && !mainService.categories && (
            <p className="mt-4 text-xs text-slate-500 rounded-lg bg-slate-50 p-3 border border-slate-200">
              This embassy's service list is scheduled for upcoming rollout — select
              &ldquo;Foreign Ministry - Oman&rdquo; to view full attestation flow.
            </p>
          )}
        </div>
      )}

      {stage === "form" && selectedRequest && (
        <div className="animate-fade-in-up">
          <ApplicationForm
            request={selectedRequest}
            defaultValues={formData ?? undefined}
            onBack={() => setStage("picking")}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}

      {stage === "submitted" && selectedRequest && (
        <div className="animate-fade-in-up mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 mb-2 border border-teal-200">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
              Document Ready for Attestation
            </div>
            <h2 className="text-xl font-bold text-gray-800">Application Details Saved</h2>
            <p className="mt-1 text-sm text-gray-600">
              Preview the generated official attestation document below for &ldquo;{selectedRequest.name}&rdquo;.
            </p>
          </div>

          {/* Action buttons at top as well for convenience */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-gray-100 py-3">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Format:</span> A4 Portrait PDF (Uploaded Document Top + Attestation Sticker Bottom)
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStage("form")}
                disabled={isGeneratingPdf}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Edit Details
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf || !attestationData}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60 transition-all cursor-pointer"
              >
                {isGeneratingPdf ? (
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
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Download Pdf</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-300 p-3 text-center text-sm font-medium text-emerald-800 animate-fade-in">
              ✓ Attestation PDF document downloaded successfully!
            </div>
          )}

          {/* Submitted Form Summary Breakdown */}
          {formData && (
            <details className="mt-4 group rounded-lg border border-gray-200 bg-gray-50/70 p-3 text-sm">
              <summary className="font-semibold text-gray-700 cursor-pointer flex items-center justify-between">
                <span>View Submitted Form Details</span>
                <span className="text-xs text-teal-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 text-gray-600">
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Applicant Name:</span>
                  <span className="font-semibold text-gray-800">{formData.applicantName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Email:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Phone Number:</span>
                  <span>{formData.phoneNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Branch:</span>
                  <span>{formData.branch}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Applying From:</span>
                  <span>{formData.applyingFrom}</span>
                </div>
                {formData.taxRegistrationNumber && (
                  <div className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="font-medium">Tax Reg. Number:</span>
                    <span>{formData.taxRegistrationNumber}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">eVerify No:</span>
                  <span>{formData.eVerifyNo}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Verify By:</span>
                  <span>{formData.verifyBy}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Verify At:</span>
                  <span>{formData.verifyAt}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Date of Attestation:</span>
                  <span>{formData.dateOfAttestation}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="font-medium">Approver Name:</span>
                  <span>{formData.approverName}</span>
                </div>
                {formData.documents && formData.documents.length > 0 && (
                  <div className="flex justify-between pt-1">
                    <span className="font-medium">Uploaded Files:</span>
                    <span className="text-teal-700 font-medium">{Array.from(formData.documents).map((f) => f.name).join(", ")}</span>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Live Full Document A4 Preview */}
          {attestationData && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800">
                  Full Attested Document Preview (A4)
                </h3>
                <span className="text-xs text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full font-medium">
                  {documentPreviewUrls.length > 1
                    ? `${documentPreviewUrls.length} Pages • Attestation Added to All Pages`
                    : "Matches Reference Document"}
                </span>
              </div>

              {/* Scrollable Container with centered A4 preview */}
              <div className="w-full overflow-x-auto rounded-xl border border-gray-300 bg-slate-100 p-4 md:p-8 flex flex-col items-center gap-8 shadow-inner">
                {documentPreviewUrls.length > 0 ? (
                  documentPreviewUrls.map((url, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      {documentPreviewUrls.length > 1 && (
                        <div className="mb-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                          Page {idx + 1} of {documentPreviewUrls.length}
                        </div>
                      )}
                      <div className="transform scale-[0.85] sm:scale-100 origin-top">
                        <AttestedDocumentPage
                          id={`attested-document-pdf-${idx}`}
                          data={attestationData}
                          documentUrl={url}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="transform scale-[0.85] sm:scale-100 origin-top">
                    <AttestedDocumentPage
                      id="attested-document-pdf-0"
                      data={attestationData}
                      documentUrl={null}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Download Button */}
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => setStage("form")}
              disabled={isGeneratingPdf}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Edit Details
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf || !attestationData}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-700 disabled:opacity-60 transition-all cursor-pointer"
            >
              {isGeneratingPdf ? (
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
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download Pdf</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
      {showRequestModal && category && (
        <Modal onClose={() => { setShowRequestModal(false); setCategoryId(""); }}>
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Service Category
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1.5">
                  {category.name}
                </h2>
              </div>
              <button
                aria-label="Close"
                className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                onClick={() => {
                  setShowRequestModal(false);
                  setCategoryId("");
                }}
              >
                ✕
              </button>
            </div>

            <p className="pt-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select your required document or request type
            </p>

            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50">
              {category.requests.map((req) => (
                <li key={req.id}>
                  <button
                    className="w-full p-4 text-left hover:bg-teal-50/80 transition-all flex items-center justify-between group cursor-pointer"
                    onClick={() => handleRequestSelect(req)}
                  >
                    <div className="flex items-center gap-3 pr-3">
                      <div className="h-8 w-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-teal-900 transition-colors">
                        {req.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                        From {(req.govFee + req.serviceFee + req.vatAmount).toFixed(2)} OMR
                      </span>
                      <svg className="h-4 w-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {/* Step: confirm fees before proceeding */}
      {showFeeModal && selectedRequest && (
        <Modal onClose={handleCancelFee}>
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Fee Confirmation
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1.5">
                  Review Official Attestation Fees
                </h2>
              </div>
              <button
                aria-label="Close"
                className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                onClick={handleCancelFee}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Document
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {selectedRequest.name}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Gov Fee</span>
                <p className="mt-1 text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                  {selectedRequest.govFee.toFixed(2)}
                  <Image width={14} height={14} src={OmaniRiel} alt="OMR" className="inline-block" />
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Service Fee</span>
                <p className="mt-1 text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                  {selectedRequest.serviceFee.toFixed(2)}
                  <Image width={14} height={14} src={OmaniRiel} alt="OMR" className="inline-block" />
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-xs">
                <span className="text-xs text-slate-500 font-medium">VAT (5%)</span>
                <p className="mt-1 text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                  {selectedRequest.vatAmount.toFixed(2)}
                  <Image width={14} height={14} src={OmaniRiel} alt="OMR" className="inline-block" />
                </p>
              </div>

              <div className="rounded-xl border border-teal-300 bg-teal-50/60 p-3.5 text-center shadow-xs">
                <span className="text-xs text-teal-800 font-bold">Total Amount</span>
                <p className="mt-1 text-sm font-black text-teal-900 flex items-center justify-center gap-1">
                  {(selectedRequest.govFee + selectedRequest.serviceFee + selectedRequest.vatAmount).toFixed(2)}
                  <Image width={14} height={14} src={OmaniRiel} alt="OMR" className="inline-block" />
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleCancelFee}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Back to List
              </button>
              <button
                onClick={handleProceed}
                className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Proceed to Form</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}