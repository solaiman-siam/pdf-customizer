"use client";

import { useMemo, useState } from "react";
import { mainServices, ServiceCategory, ServiceRequest } from "@/lib/data";
import Stepper from "./Components/Stepper";
import ApplicationForm, { ApplicationFormData } from "./Components/ApplicationForm";
import Modal from "./Components/Modal";
import AttestedDocumentPage from "./Components/AttestedDocumentPage";
import { AttestationData } from "./Components/AttestationCertificate";
import { generateAttestationPdf } from "@/lib/pdfGenerator";
import { fileToDataUrl } from "@/lib/documentLoader";
import Image from "next/image";
import OmaniRiel from "@/app/assets/images/omani-real.png";

type FlowStage = "picking" | "form" | "submitted";

export default function Home() {
  const [mainServiceId, setMainServiceId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<FlowStage>("picking");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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
    if (formattedDate && formattedDate.includes('T')) {
      formattedDate = formattedDate.replace('T', ' ') + ':00';
    }

    return {
      eVerifyNo: formData.eVerifyNo,
      verifyBy: formData.verifyBy,
      verifyAt: formData.verifyAt,
      applicantName: formData.applicantName.toUpperCase(),
      documentName: selectedRequest.name,
      dateOfAttestation: formattedDate,
      approverName: formData.approverName,
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
    console.log("Form Submitted Information:", data);
    setFormData(data);

    if (data.documents && data.documents.length > 0) {
      try {
        const url = await fileToDataUrl(data.documents[0]);
        setDocumentPreviewUrl(url);
      } catch (err) {
        console.error("Failed to load uploaded document preview:", err);
        setDocumentPreviewUrl(null);
      }
    } else {
      setDocumentPreviewUrl(null);
    }

    setStage("submitted");
  }

  async function handleDownloadPdf() {
    if (!attestationData) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      await generateAttestationPdf(
        "attested-document-pdf",
        `Oman_Attested_${attestationData.eVerifyNo}.pdf`
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-200/70 p-8 text-black">
      <h1 className="mb-6 text-center text-xl font-semibold text-gray-800">
        {mainService?.name ?? "Foreign Ministry - Oman"}
      </h1>

      <Stepper currentStep={currentStep} />

      {stage === "picking" && (
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {!mainService && (
            <div className="flex flex-col gap-2">
              <label className="pl-1 text-sm text-gray-600" htmlFor="main-service">
                Please select the service
              </label>
              <select
                id="main-service"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
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
            </div>
          )}

          {mainService && mainService.categories && (
            <div className="flex flex-col gap-2">
              <label className="pl-1 text-sm text-orange-500" htmlFor="category">
                Select or search a Service Category in the list...
              </label>
              <select
                id="category"
                className="w-full rounded border border-gray-300 px-4 py-2 text-sm"
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
            </div>
          )}

          {mainService && (
            <p className="mt-4 rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Make sure all pre-requisite attestation steps are completed before applying for Oman
              Embassy / Foreign Ministry Attestation
            </p>
          )}

          <button
            type="button"
            className="mt-4 w-full rounded bg-slate-800 px-4 py-2 text-left text-sm font-medium text-white hover:bg-slate-900"
          >
            How To Apply - Link
          </button>

          {mainService && !mainService.categories && (
            <p className="mt-4 text-sm text-gray-500">
              This embassy's service list isn't wired up in this demo yet — pick
              &ldquo;Foreign Ministry - Oman&rdquo; to see the full flow.
            </p>
          )}
        </div>
      )}

      {stage === "form" && selectedRequest && (
        <ApplicationForm
          request={selectedRequest}
          defaultValues={formData ?? undefined}
          onBack={() => setStage("picking")}
          onSubmit={handleFormSubmit}
        />
      )}

      {stage === "submitted" && selectedRequest && (
        <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
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
                  Matches Reference Document
                </span>
              </div>

              {/* Scrollable Container with centered A4 preview */}
              <div className="w-full overflow-x-auto rounded-xl border border-gray-300 bg-slate-100 p-4 md:p-8 flex justify-center shadow-inner">
                <div className="transform scale-[0.85] sm:scale-100 origin-top">
                  <AttestedDocumentPage
                    id="attested-document-pdf"
                    data={attestationData}
                    documentUrl={documentPreviewUrl}
                  />
                </div>
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

      {/* Step: choose the specific service request */}
      {showRequestModal && category && (
        <Modal>
          <h2 className="pt-6 text-center text-lg font-semibold text-gray-800">
            {category.name}
          </h2>
          <div className="mt-4 flex items-center justify-between bg-teal-500 px-6 py-3">
            <h3 className="text-sm font-semibold text-white">Select a Service Request in the list</h3>
            <button
              aria-label="Close"
              className="text-white hover:opacity-80"
              onClick={() => {
                setShowRequestModal(false);
                setCategoryId("");
              }}
            >
              ✕
            </button>
          </div>
          <p className="px-6 pt-3 text-sm text-gray-500">Select or search a Service Request in the list...</p>
          <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto px-2 pb-4">
            {category.requests.map((req, i) => (
              <li key={req.id}>
                <button
                  className={`w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 ${
                    i % 2 === 1 ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleRequestSelect(req)}
                >
                  {req.name}
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {/* Step: confirm fees before proceeding */}
      {showFeeModal && selectedRequest && (
        <Modal>
          <h2 className="pt-6 text-center text-lg font-semibold text-gray-800">
            {category?.name}
          </h2>
          <div className="mt-4 flex items-center justify-between bg-teal-500 px-6 py-3">
            <h3 className="text-sm font-semibold text-white">Service Request Name</h3>
            <button
              aria-label="Close"
              className="text-white hover:opacity-80"
              onClick={handleCancelFee}
            >
              ✕
            </button>
          </div>
          <div className="px-6 py-4">
            <p className="rounded border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
              {selectedRequest.name}
            </p>

            <div className="mt-5 grid grid-cols-4 gap-4 text-center">
              <FeeCell label="Document Name" value={selectedRequest.name} isName />
             <div>
             
               <FeeCell label="Government Fees" value={selectedRequest.govFee.toFixed(2)} />
             </div>
              <FeeCell label="Service Fees" value={selectedRequest.serviceFee.toFixed(2)} />
               <FeeCell label="VAT Amount" value={selectedRequest.vatAmount.toFixed(2)} />
            </div>
            <div className="mt-4 flex justify-center">
             
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelFee}
                className="rounded border border-teal-500 px-5 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="rounded bg-teal-500 px-5 py-2 text-sm font-medium text-white hover:bg-teal-600"
              >
                Proceed
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function FeeCell({ label, value, isName }: { label: string; value: string; isName?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 flex justify-center items-center gap-2 font-medium text-gray-800 ${isName ? "text-sm" : "text-sm"}`}> {value} {isName ||  <Image width={20} height={20} src={OmaniRiel} alt="omani-riel"/> } </p>
    </div>
  );
}