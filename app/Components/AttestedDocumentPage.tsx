"use client";

import React from "react";
import AttestationCertificate, { AttestationData } from "./AttestationCertificate";

interface AttestedDocumentPageProps {
  data: AttestationData;
  documentUrl?: string | null;
  id?: string;
  className?: string;
}

export default function AttestedDocumentPage({
  data,
  documentUrl,
  id = "attested-document-page",
  className = "",
}: AttestedDocumentPageProps) {
  return (
    <div
      id={id}
      className={`mx-auto flex flex-col justify-between overflow-hidden shadow-2xl ${className}`}
      style={{
        width: "694px", // Standard A4 width at 96 DPI
        minHeight: "1000px", // Standard A4 height at 96 DPI
        height: "1000px",
        boxSizing: "border-box",
        padding: "1px 20px 16px 20px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Top Part: Uploaded Document (approx 64% of A4 page with left/right gap to preserve aspect ratio) */}
      <div
        className="relative flex-1 w-full flex flex-col items-center  overflow-hidden mb-2"
        style={{
          backgroundColor: "#ffffff",
          minHeight: "680px",
          padding: "0px", // Left and right gaps
          boxSizing: "border-box",
        }}
      >
        {documentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={documentUrl}
            alt="Uploaded Document"
            className="select-none"
            style={{
              maxWidth: "100%",
              maxHeight: "675px",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              margin: "0 auto",
              display: "block",
            }}
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{
              backgroundColor: "#f8fafc",
              border: "1px dashed #cbd5e1",
              borderRadius: "4px",
              color: "#64748b",
              maxHeight: "640px",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: "#f0fdfa",
                border: "1px solid #99f6e4",
                color: "#0d9488",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#0d9488"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p
              className="font-semibold text-base"
              style={{ color: "#1e293b" }}
            >
              {data.documentName || "Uploaded Document"}
            </p>
            <p
              className="text-xs mt-1 max-w-sm"
              style={{ color: "#64748b" }}
            >
              The uploaded document will be positioned in this top section of the attested PDF.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Part: Official Attestation Sticker & Footer (approx 36% of A4 page) */}
      <div className="w-full flex-shrink-0">
        <AttestationCertificate data={data} />
      </div>
    </div>
  );
}
