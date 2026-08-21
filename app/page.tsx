"use client";

import { useMemo, useState } from "react";
import { mainServices, ServiceCategory, ServiceRequest } from "@/lib/data";
import Stepper from "./Components/Stepper";
import ApplicationForm, { ApplicationFormData } from "./Components/ApplicationForm";
import Modal from "./Components/Modal";
import Image from "next/image";
import OmaniRiel  from '@/app/assets/images/omani-real.png'

type FlowStage = "picking" | "form" | "submitted";

export default function Home() {
  const [mainServiceId, setMainServiceId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData | null>(null);
  const [stage, setStage] = useState<FlowStage>("picking");

  const mainService = useMemo(
    () => mainServices.find((s) => s.id === mainServiceId) ?? null,
    [mainServiceId]
  );
  const category: ServiceCategory | null = useMemo(
    () => mainService?.categories?.find((c) => c.id === categoryId) ?? null,
    [mainService, categoryId]
  );

  const currentStep = stage === "picking" ? 1 : stage === "form" ? 2 : 4;

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

  function handleFormSubmit(data: ApplicationFormData) {
    console.log("Form Submitted Information:", data);
    setFormData(data);
    setStage("submitted");
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
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">Application Details Saved</h2>
            <p className="mt-1 text-sm text-gray-600">
              Next you&rsquo;d move to Check and Pay for &ldquo;{selectedRequest.name}&rdquo;.
            </p>
          </div>

          {formData && (
            <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-5 text-sm">
              <h3 className="mb-3 font-semibold text-gray-700">Submitted Form Information</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Applicant Name:</span>
                  <span>{formData.applicantName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Email:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Phone Number:</span>
                  <span>{formData.phoneNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Branch:</span>
                  <span>{formData.branch}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Applying From:</span>
                  <span>{formData.applyingFrom}</span>
                </div>
                {formData.taxRegistrationNumber && (
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-medium">Tax Reg. Number:</span>
                    <span>{formData.taxRegistrationNumber}</span>
                  </div>
                )}
                {formData.documents && formData.documents.length > 0 && (
                  <div className="flex justify-between pt-1">
                    <span className="font-medium">Documents:</span>
                    <span>{Array.from(formData.documents).map((f) => f.name).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setStage("form")}
              className="rounded border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={() => alert("Proceeding to payment step...")}
              className="rounded bg-teal-500 px-5 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors"
            >
              Continue to Payment
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