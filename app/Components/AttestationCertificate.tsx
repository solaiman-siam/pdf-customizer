"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

export interface AttestationData {
  eVerifyNo: string;
  verifyBy: string;
  verifyAt: string;
  applicantName: string;
  documentName: string;
  dateOfAttestation: string;
  approverName: string;
}

export function OmanSeal({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
      style={{ width: "115px" }}
    >
      <svg
        viewBox="0 0 200 200"
        style={{ width: "105px", height: "105px" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Border */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="#ffffff"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />

        {/* Curved Text Paths */}
        <defs>
          <path
            id="topCurve"
            d="M 30,100 A 70,70 0 0,1 170,100"
            fill="none"
          />
          <path
            id="bottomCurve"
            d="M 30,100 A 70,70 0 0,0 170,100"
            fill="none"
          />
        </defs>

        {/* Arabic Top: سلطنة عمان */}
        <text
          fill="#842b32"
          fontSize="17"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1"
        >
          <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
            سلطنة عُمان
          </textPath>
        </text>

        {/* English Bottom: SULTANATE OF OMAN */}
        <text
          fill="#842b32"
          fontSize="10.5"
          fontWeight="600"
          fontFamily="Arial, sans-serif"
          letterSpacing="2.5"
        >
          <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
            SULTANATE OF OMAN
          </textPath>
        </text>

        {/* Central Emblem of Oman (Khanjar & Crossed Swords) */}
        <g transform="translate(100, 95) scale(0.58)" fill="#9e2a2b" stroke="#9e2a2b">
          {/* Crossed Swords */}
          {/* Sword 1 - Left to Right */}
          <path
            d="M-55,-35 Q-15,-5 45,35 L40,40 Q-20,0 -60,-30 Z"
            fill="#a61c24"
          />
          <rect x="-68" y="-45" width="18" height="6" transform="rotate(35 -59 -42)" fill="#801319" />
          <circle cx="-62" cy="-44" r="5" fill="#801319" />

          {/* Sword 2 - Right to Left */}
          <path
            d="M55,-35 Q15,-5 -45,35 L-40,40 Q20,0 60,-30 Z"
            fill="#a61c24"
          />
          <rect x="50" y="-45" width="18" height="6" transform="rotate(-35 59 -42)" fill="#801319" />
          <circle cx="62" cy="-44" r="5" fill="#801319" />

          {/* Central Khanjar */}
          <path
            d="M-10,-48 L10,-48 L8,-32 L13,-28 L-13,-28 L-8,-32 Z"
            fill="#801319"
          />
          <line x1="-12" y1="-30" x2="12" y2="-30" stroke="#ffffff" strokeWidth="1.5" />
          
          <rect x="-16" y="-28" width="32" height="12" rx="3" fill="#a61c24" />
          <circle cx="-9" cy="-22" r="3" fill="#ffffff" />
          <circle cx="0" cy="-22" r="3" fill="#ffffff" />
          <circle cx="9" cy="-22" r="3" fill="#ffffff" />

          <path
            d="M-14,-16 C-14,8 -10,22 12,38 C16,41 22,43 30,44 C26,48 18,48 10,46 C-14,40 -20,18 -18,-16 Z"
            fill="#a61c24"
          />
          <path
            d="M-12,-10 C-10,4 -6,14 10,28"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          <path
            d="M-8,-2 C-6,8 -2,16 12,24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          <circle cx="28" cy="44" r="3" fill="#801319" />
        </g>
      </svg>

      {/* Under-Seal Typography */}
      <div className="mt-0.5 text-center leading-tight">
        <p
          className="text-[11px] font-bold font-serif"
          style={{ color: "#9e2a2b" }}
          dir="rtl"
        >
          وِزَارَةُ الخَارِجِيَّة
        </p>
        <p
          className="text-[9px] font-semibold tracking-wide"
          style={{ color: "#334155" }}
        >
          Foreign Ministry
        </p>
      </div>
    </div>
  );
}

interface AttestationCardProps {
  data: AttestationData;
  className?: string;
}

/**
 * The official Attestation Card (sticker box) with gold top banner,
 * Oman seal on the left, and 3-column table on the right.
 */
export function AttestationCard({ data, className = "" }: AttestationCardProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: "515px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Outer Border Box */}
      <div
        className="relative pt-0 pb-2 px-2.5"
        style={{
          border: "1.5px solid #8ca3b3",
          borderRadius: "1px",
        }}
      >
        {/* Top Gold / Ochre Banner */}
        <div
          className="mx-auto -mt-0.5 py-1 px-3 text-center shadow-sm"
          style={{
            width: "82%",
            maxWidth: "420px",
            backgroundColor: "#ba9b56",
            color: "#ffffff",
            borderRadius: "0 0 2px 2px",
          }}
        >
          <p
            className="text-[11.5px] font-bold leading-tight tracking-normal"
            dir="rtl"
            style={{
              fontFamily: "'Traditional Arabic', 'Segoe UI', Tahoma, sans-serif",
              color: "#ffffff",
            }}
          >
            نصادق على صحة توقيع المسؤول والختم
          </p>
          <p
            className="text-[9.5px] font-medium leading-tight mt-0.5"
            dir="rtl"
            style={{
              fontFamily: "'Traditional Arabic', 'Segoe UI', Tahoma, sans-serif",
              color: "#ffffff",
            }}
          >
            دون تحمل الوزارة أية مسؤولية فيما يختص بمحتويات الوثيقة
          </p>
        </div>

        {/* Main Card Row: Seal + Table */}
        <div className="mt-2.5 flex items-center gap-3">
          {/* Left Seal */}
          <div className="flex-shrink-0 flex justify-center pl-0.5" style={{ width: "118px" }}>
            <OmanSeal />
          </div>

          {/* Center/Right Table */}
          <div className="flex-1 pr-1">
            <table className="w-full border-collapse" style={{ fontSize: "11.5px" }}>
              <tbody>
                <tr>
                  <td
                    className="py-0.5 text-left font-bold whitespace-nowrap"
                    style={{ width: "125px", color: "#0f172a" }}
                  >
                    e-Verify No
                  </td>
                  <td
                    className="py-0.5 px-1.5 text-left font-bold"
                    style={{ color: "#000000" }}
                  >
                    {data.eVerifyNo}
                  </td>
                  <td
                    className="py-0.5 text-right font-bold whitespace-nowrap"
                    style={{ width: "125px", color: "#0f172a" }}
                    dir="rtl"
                  >
                    رقم التصديق
                  </td>
                </tr>

                <tr>
                  <td
                    className="py-0.5 text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Verify By
                  </td>
                  <td
                    className="py-0.5 px-1.5 text-left font-bold"
                    style={{ color: "#000000" }}
                  >
                    {data.verifyBy}
                  </td>
                  <td
                    className="py-0.5 text-right font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    تم التحقق من قبل
                  </td>
                </tr>

                <tr>
                  <td
                    className="py-0.5 text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Verify at
                  </td>
                  <td
                    className="py-0.5 px-1.5 text-left font-bold"
                    style={{ color: "#000000" }}
                  >
                    {data.verifyAt}
                  </td>
                  <td
                    className="py-0.5 text-right font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    تم التحقق في
                  </td>
                </tr>

                <tr>
                  <td
                    className="py-0.5 text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Applicant Name
                  </td>
                  <td
                    className="py-0.5 px-1.5 text-left font-bold uppercase"
                    style={{ color: "#000000" }}
                  >
                    {data.applicantName}
                  </td>
                  <td
                    className="py-0.5 text-right font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    اسم العميل
                  </td>
                </tr>

                <tr>
                  <td
                    className="py-0.5 text-left font-bold align-top whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Document Name
                  </td>
                  <td
                    className="py-0.5 px-1.5 text-left font-bold align-top leading-snug"
                    style={{ color: "#000000" }}
                  >
                    {data.documentName}
                  </td>
                  <td
                    className="py-0.5 text-right font-bold align-top whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    اسم الوثيقة
                  </td>
                </tr>

                <tr>
                  <td
                    className="py-0.5 text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Date of Attestation
                  </td>
                  <td
                    className="py-0.5 px-1.5 text-left font-bold"
                    style={{ color: "#000000" }}
                  >
                    {data.dateOfAttestation}
                  </td>
                  <td
                    className="py-0.5 text-right font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    تاريخ التصديق
                  </td>
                </tr>

                <tr>
                  <td
                    className="py-0.5 text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Approver Name
                  </td>
                  <td
                    className="py-0.5 px-1.5 text-left font-bold"
                    style={{ color: "#000000" }}
                  >
                    {data.approverName}
                  </td>
                  <td
                    className="py-0.5 text-right font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    تمت المصادقة من قبل
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AttestationCertificate({
  data,
  id,
  className = "",
}: {
  data: AttestationData;
  id?: string;
  className?: string;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const payload = JSON.stringify({
      verificationNo: data.eVerifyNo,
      applicant: data.applicantName,
      document: data.documentName,
      verifyAt: data.verifyAt,
      date: data.dateOfAttestation,
      approver: data.approverName,
      issuer: "Foreign Ministry - Sultanate of Oman",
    });

    QRCode.toDataURL(
      `https://verify.fm.gov.om/attestation?id=${encodeURIComponent(
        data.eVerifyNo
      )}&payload=${encodeURIComponent(payload)}`,
      {
        width: 300,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }
    )
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [data]);

  return (
    <div id={id} className={`w-full ${className}`}>
      {/* Right-aligned Attestation Card */}
      <div className="flex justify-end w-full">
        <AttestationCard data={data} />
      </div>

      {/* Horizontal Divider Line under Card */}
      <div
        className="w-full mt-3"
        style={{
          borderTop: "1.5px solid #4a687d",
        }}
      />

      {/* Bottom Footer: Left = Blockchain Verified, Right = Arabic Text & QR Code */}
      <div className="w-full mt-2 flex items-center justify-between gap-3">
        {/* Far Left: Blockchain Verified */}
        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ fontSize: "11px", color: "#64748b" }}
        >
          <svg
            className="w-4 h-4"
            style={{ color: "#10b981" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span style={{ color: "#64748b" }}>Blockchain Verified</span>
        </div>

        {/* Right Section: Arabic Notice & QR Code */}
        <div className="flex items-center gap-3">
          <div className="text-right" dir="rtl">
            <p
              className="font-bold tracking-wide"
              style={{ fontSize: "13px", color: "#000000" }}
            >
              بالرقم تصديق :{" "}
              <span
                className="font-mono font-extrabold"
                style={{ fontSize: "13.5px", color: "#000000" }}
              >
                {data.eVerifyNo}
              </span>
            </p>
            <p
              className="mt-0.5 font-bold leading-normal"
              style={{ fontSize: "11.5px", color: "#000000" }}
            >
              تم إنجاز المعاملة إلكترونيا و للتأكد من صحة المعاملة يمكنك مسح الباركود{" "}
              <span className="font-sans font-bold" dir="ltr" style={{ color: "#000000" }}>
                (QR Code)
              </span>
            </p>
          </div>

          {/* QR Code */}
          <div
            className="flex-shrink-0 flex items-center justify-center p-0.5"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #d1d5db",
            }}
          >
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="Verification QR Code"
                style={{ width: "68px", height: "68px", objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  backgroundColor: "#f3f4f6",
                  color: "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                }}
              >
                QR
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
