"use client";

import React, { use } from "react";
import Image from "next/image";
import { images } from "@/lib/imageProvider";
import { useQuery } from "@tanstack/react-query";
import { getPdfDetails } from "@/app/services/pdfApi";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);


  const eVerifyNo = resolvedParams?.id;

  // console.log("eVerifyNo:", eVerifyNo)
  // console.log(resolvedParams)

  const { data: pdfInfo, isLoading } = useQuery({
    queryKey: ["pdf-details", eVerifyNo],
    queryFn: () => getPdfDetails(eVerifyNo),
  });

  // console.log("pdfInfo:", pdfInfo);

  const record = pdfInfo?.data ?? {};

  const openPdfInNewTab = (bufferObj: { type: string; data: number[] } | undefined) => {
    if (!bufferObj?.data) return;
    const bytes = new Uint8Array(bufferObj.data);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div
      className="min-h-screen   bg-[#f3f4f6] py-6 px-7 sm:py-10 sm:px-14 flex flex-col items-center justify-start print:bg-white print:p-0"
      style={{
        fontFamily:
          "Calibri, var(--font-carlito), Carlito, 'Segoe UI', Candara, Arial, sans-serif",
      }}
    >
      {/* ── Outer Wrapper with Outside Vertical Text ── */}
      <div className="relative border bg-white sm:p-18 border-black-500 w-full max-w-[1100px]">
        {/* Vertical text OUTSIDE the black box on the left */}
        <div
          className="absolute -left-5 sm:left-10 top-1/2 -translate-y-1/2 text-[#49afcd] text-[9.5px] sm:text-[19.5px] font-normal tracking-wide select-none pointer-events-none whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Powered by VFS Global
        </div>

        {/* ── Document Page Container (Outer Black Border) ── */}
        <div
          className="w-full bg-white border border-black p-4 sm:px-12 sm:py-10 shadow-md print:shadow-none print:border-black print:p-8"
          style={{
            fontFamily:
              "Calibri, var(--font-carlito), Carlito, 'Segoe UI', Candara, Arial, sans-serif",
          }}
        >
          {/* ── Top Header: Logos ── */}
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
            {/* Left: Oman Post Logo */}
            <div className="w-[120px] sm:w-[290px]">
              <Image
                src={images.OmanDetailsLogo}
                alt="Oman Post Logo"
                width={270}
                height={90}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            {/* Right: Foreign Ministry Logo */}
            <div className="w-[60px] sm:w-[205px]">
              <Image
                src={images.OmanDetailsMainLogo}
                alt="Foreign Ministry Logo"
                width={145}
                height={145}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* ── Document Titles (Centered) ── */}
          <div className="text-center my-3 sm:my-6">
            <h2
              className="text-[#49afcd] font-bold text-base sm:text-[22px] tracking-wide mb-0.5 sm:mb-1 leading-snug"
              dir="rtl"
            >
              بيانات التصديق الرقمي
            </h2>
            <h1 className="text-[#49afcd] font-bold text-lg sm:text-[25px] tracking-normal leading-tight">
              Digital Attestation Result
            </h1>
          </div>

          {/* ── Tables Container ── */}
          <div className="flex flex-col gap-3.5 sm:gap-5 text-[11px] sm:text-[13.5px]">
            {/* ── SECTION 1: Transaction Details ── */}
            <div className="w-full">
              {/* Tab Header */}
              <div className="inline-block border border-[#94a3b8] border-b-0 bg-white px-2 py-0.5  text-[#aeaeae] italic font-semibold text-[10px] sm:text-[13px] w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] leading-tight">
                Transaction Details
              </div>
              {/* Table */}
              <table className="w-full border-collapse border border-[#94a3b8] table-fixed">
                <tbody>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Transaction Number
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.eVerifyNo ?? "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Payment ID
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.paymentId ?? "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Total Payment
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.totalPayment ?? "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Transaction Date
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.transactionDate ?? "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── SECTION 2: Candidate Details ── */}
            <div className="w-full">
              {/* Tab Header */}
              <div className="inline-block border border-[#94a3b8] border-b-0 bg-white px-2 py-0.5  text-[#aeaeae] italic font-semibold text-[10px] sm:text-[13px] w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] leading-tight">
                Candidate Details
              </div>
              {/* Table */}
              <table className="w-full border-collapse border border-[#94a3b8] table-fixed">
                <tbody>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Document Type
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.documentName ?? "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Applicant Name
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.applicantName ?? "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Email Id
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.email ?? "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Phone Number
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.phoneNumber ?? "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── SECTION 3: Verification Details ── */}
            <div className="w-full">
              {/* Tab Header */}
              <div className="inline-block border border-[#94a3b8] border-b-0 bg-white px-2 py-0.5  text-[#aeaeae] italic font-semibold text-[10px] sm:text-[14px] w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] leading-tight">
                Verification Details
              </div>
              {/* Table */}
              <table className="w-full border-collapse border border-[#94a3b8] table-fixed">
                <tbody>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Verifier Name
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.verifyBy ?? "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Verification Status
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.approverName ?? "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Verification Date & Time
                    </td>
                    <td className="px-1  py-1 text-[#1b6394] font-black break-words leading-tight">
                      {record.verifyAt ?? "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── SECTION 4: Document Details ── */}
            <div className="w-full">
              {/* Tab Header */}
              <div className="inline-block border border-[#94a3b8] border-b-0 bg-white px-2 py-0.5  text-[#aeaeae] italic font-semibold text-[10px] sm:text-[14px] w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] leading-tight">
                Document Details
              </div>
              {/* Table */}
              <table className="w-full border-collapse border border-[#94a3b8] table-fixed">
                <tbody>
                  <tr className="border-b border-[#94a3b8]">
                    <td className="w-[32%] sm:w-[260px] min-w-[85px] sm:min-w-[260px] border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Original Document
                    </td>
                    <td className="px-1  py-1 break-words leading-tight">
                      <button
                        onClick={() => openPdfInNewTab(record.originalPdf)}
                        className="text-[#1b6394] font-bold italic hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        View Document
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r border-[#94a3b8] px-1  py-1 font-normal text-slate-800 break-words leading-tight">
                      Attested Document
                    </td>
                    <td className="px-1  py-1 break-words leading-tight">
                      <button
                        onClick={() => openPdfInNewTab(record.documents)}
                        className="text-[#1b6394] font-bold italic hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        View Document
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

