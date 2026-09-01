"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPdfList } from "../services/pdfApi";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PdfRecord {
  id: string;
  documentName: string;
  generatedDate: string;
  fileSize: string;
  downloadUrl: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockRecords: PdfRecord[] = [
  {
    id: "ATT-2026-00124",
    documentName: "University Degree Certificate",
    generatedDate: "2026-08-28",
    fileSize: "1.2 MB",
    downloadUrl: "#",
  },
  {
    id: "ATT-2026-00119",
    documentName: "Birth Certificate - Attestation",
    generatedDate: "2026-08-25",
    fileSize: "840 KB",
    downloadUrl: "#",
  },
  {
    id: "ATT-2026-00113",
    documentName: "Commercial Agreement Legalization",
    generatedDate: "2026-08-20",
    fileSize: "2.1 MB",
    downloadUrl: "#",
  },
  {
    id: "ATT-2026-00108",
    documentName: "Marriage Certificate",
    generatedDate: "2026-08-15",
    fileSize: "950 KB",
    downloadUrl: "#",
  },
  {
    id: "ATT-2026-00101",
    documentName: "Certificate of Origin",
    generatedDate: "2026-08-10",
    fileSize: "1.5 MB",
    downloadUrl: "#",
  },
  {
    id: "ATT-2026-00097",
    documentName: "Power of Attorney",
    generatedDate: "2026-08-05",
    fileSize: "670 KB",
    downloadUrl: "#",
  },
  {
    id: "ATT-2026-00091",
    documentName: "Diploma Transcript",
    generatedDate: "2026-07-30",
    fileSize: "1.8 MB",
    downloadUrl: "#",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PdfGallary() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: pdfList = {} } = useQuery({
    queryKey: ["pdf-lists"],
    queryFn: () => getPdfList(),
  });

  // console.log(pdfList)

  const records: any[] = pdfList?.data || [];

  function handleDownload(record: any) {
    const recordId = record?._id || record?.eVerifyNo || record?.id;
    setDownloadingId(recordId);

    try {
      // 1. Buffer byte array format from backend: { type: "Buffer", data: number[] }
      if (record?.documents?.data && Array.isArray(record.documents.data)) {
        const byteArray = new Uint8Array(record.documents.data);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const cleanName = (record.documentName || "Attestation_Document")
          .replace(/[^a-zA-Z0-9_-]/g, "_");
        a.download = `${cleanName}_${record.eVerifyNo || "cert"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      // 2. Base64 or URL string format
      else if (typeof record?.documents === "string" && record.documents.length > 0) {
        const isBase64 =
          !record.documents.startsWith("http") &&
          !record.documents.startsWith("blob:");
        const href = isBase64
          ? record.documents.startsWith("data:")
            ? record.documents
            : `data:application/pdf;base64,${record.documents}`
          : record.documents;
        const a = document.createElement("a");
        a.href = href;
        a.download = `${record.documentName || "Attestation_Document"}_${record.eVerifyNo || "cert"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      // 3. Fallback downloadUrl
      else if (record?.downloadUrl && record.downloadUrl !== "#") {
        window.open(record.downloadUrl, "_blank");
      } else {
        console.warn("No document data found for download:", record);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 1000);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* ── Background Glow ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-teal-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-indigo-600/6 blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <svg className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">Foreign Ministry</p>
            <h1 className="text-base font-black tracking-tight leading-tight">PDF Gallery</h1>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </header>

      {/* ── Page Body ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">

        {/* ── Page Title + Stats Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Download History</h2>
            <p className="mt-1 text-sm text-slate-400">All your attested &amp; legalized documents in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-center backdrop-blur-md">
              <p className="text-xl font-black text-teal-400">{records.length}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-center backdrop-blur-md">
              <p className="text-xl font-black text-slate-300">{records.length}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Showing</p>
            </div>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/4">
                  <th className="px-5 py-4 text-left text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    Reference ID
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    Generated On
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    Document Name
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    Verifier/Issuing Authority
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-500 text-sm">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        No records found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((record: any, idx: number) => {
                    const recordId = record._id || record.eVerifyNo || record.id || idx;
                    const isDownloading = downloadingId === recordId;

                    return (
                      <tr
                        key={recordId}
                        className="group transition-colors hover:bg-teal-500/5"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        {/* Reference ID */}
                        <td className="px-5 py-4 font-mono text-xs text-teal-400 font-semibold whitespace-nowrap">
                          {record.eVerifyNo || record.id || "—"}
                        </td>

                        {/* Generated Date */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs font-medium">
                          {record.createdAt
                            ? new Date(record.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : record.dateOfAttestation || "—"}
                        </td>

                        {/* Document Name */}
                        <td className="px-5 py-4 max-w-55">
                          <div className="flex items-center gap-2.5">
                            <div className="shrink-0 h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                              <svg className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-white truncate">
                              {record.documentName || "Attestation Document"}
                            </span>
                          </div>
                        </td>

                        {/* Verifier */}
                        <td className="px-5 py-4 max-w-55">
                          <span className="text-sm font-semibold text-white truncate">
                            {"Foreign Ministry - Oman"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/pdf/${record.eVerifyNo}`}
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 transition-all duration-150"
                            >
                              View
                            </Link>
                            <button
                              id={`download-${recordId}`}
                              onClick={() => handleDownload(record)}
                              disabled={isDownloading}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                                isDownloading
                                  ? "bg-teal-500/30 text-teal-300 scale-95"
                                  : "bg-teal-500 text-slate-950 hover:bg-teal-400 hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20"
                              }`}
                            >
                              {isDownloading ? (
                                <>
                                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                  </svg>
                                  Downloading…
                                </>
                              ) : (
                                <>
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  Download
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Table Footer ── */}
          <div className="flex items-center justify-between border-t border-white/8 px-5 py-3.5 bg-white/2">
            <p className="text-xs text-slate-500">
              Showing <span className="text-slate-300 font-semibold">{records.length}</span> records
            </p>
            <p className="text-xs text-slate-600">
              Foreign Ministry · Document Attestation System 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
