"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Carlito } from "next/font/google";
import { images } from "@/lib/imageProvider";
import Image from "next/image";

const carlito = Carlito({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

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
      className={`flex flex-col items-center  justify-center text-center ${carlito.className} ${className}`}
      style={{ width: "80px" }}
    >
      <Image
  src={images.OmanLogo}
  alt="Oman Seal"
  width={150}
  height={150}
  className="block w-auto h-auto ml-0"
/>
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
export function AttestationCard({
  data,
  className = "",
}: AttestationCardProps) {
  return (
    <div
      className={`relative  ${carlito.className} ${className} pr-3`}
      style={{
        width: "340px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        fontFamily:
          "var(--font-carlito), Carlito, Arial, Helvetica, sans-serif",
      }}
    >
      {/* Outer Border Box */}
      <div
        className="relative -mt-14  pb-8 px-2.5"
        style={{
          border: "1.5px solid #8ca3b3",
          borderRadius: "1px",
        }}
      >
        {/* Top Gold / Ochre Banner */}
     <div className="-mt-3">
        <Image
  src={images.TopBanner}
  alt="banner"
  width={400}
  height={200}
  className=" max-w-67.5 mx-auto"
/>
     </div>

        {/* Main Card Row: Seal + Table */}
        <div className=" flex relative items-center gap-3">
          {/* Left Seal */}
          <div
            className="shrink-0 top-1/2 -translate-y-1/2  -left-20 flex absolute justify-center pl-0.5"
            style={{ width: "138px" }}
          >
            <OmanSeal />
          </div>

          {/* Center/Right Table */}
          <div className="flex-1 -mt-1  pl-8 pr-1">
            <table
              className="w-full border-collapse"
              style={{ fontSize: "9px" }}
            >
              <tbody>
                <tr>
                  <td
                    className=" text-left font-extrabold whitespace-nowrap"
                    style={{ width: "45px", color: "#0f172a" }}
                  >
                    e-Verify No
                  </td>
                  <td
                    className=" px-1.5 text-left text-nowrap font-bold"
                    style={{ color: "#000000", width: "140px" }}
                  >
                    {data.eVerifyNo}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top"
                    style={{ width: "125px", color: "#0f172a" }}
                    dir="rtl"
                  >
                    رقم التصديق
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Verify By
                  </td>
                  <td
                    className=" px-1.5 text-left font-bold"
                    style={{ color: "#000000", width: "140px" }}
                  >
                    {data.verifyBy}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    تم التحقق من قبل
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Verify at
                  </td>
                  <td
                    className=" px-1.5 text-left font-bold"
                    style={{ color: "#000000", width: "140px" }}
                  >
                    {data.verifyAt}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    تم التحقق في
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-wrap text-left justify-start font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Applicant <br />
                    Name
                  </td>
                  <td
                    className=" px-1.5 flex text-left justify-start text-nowrap font-bold uppercase"
                    style={{ color: "#000000", width: "140px" }}
                  >
                    {data.applicantName}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    اسم العميل
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left font-bold align-top whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Document <br /> Name
                  </td>
                  <td
                    className=" px-1.5 flex text-left w-full font-bold align-top leading-snug"
                    style={{ color: "#000000", width: "150px" }}
                  >
                    {data.documentName}
                  </td>
                  <td
                    className=" text-left font-bold align-top "
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    اسم الوثيقة
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left h-fit font-bold "
                    style={{ color: "#0f172a" }}
                  >
                    Date of <br /> Attestation
                  </td>
                  <td
                    className=" px-1.5 text-left flex text-nowrap font-bold"
                    style={{ color: "#000000", width: "140px" }}
                  >
                    {data.dateOfAttestation}
                  </td>
                  <td
                    className=" text-left font-bold align-top"
                    style={{ color: "#0f172a" }}
                    dir="rtl"
                  >
                    تاريخ التصديق
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left font-bold whitespace-nowrap"
                    style={{ color: "#0f172a" }}
                  >
                    Approver <br /> Name
                  </td>
                  <td
                    className=" px-1.5 text-left flex font-bold"
                    style={{ color: "#000000", width: "150px" }}
                  >
                    {data.approverName}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top"
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
    const baseUrl =
      process.env.NEXT_PUBLIC_QRCODE_URL ?? window.location.origin;
    const qrContent = data.eVerifyNo
      ? `${baseUrl}/pdf/${data.eVerifyNo}`
      : baseUrl;

    QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#363636",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [data.eVerifyNo]);

  return (
    <div
      id={id}
      className={`w-full ${carlito.className} ${className}`}
      style={{ fontFamily: "var(--font-carlito), Carlito, Arial, sans-serif" }}
    >
      {/* Right-aligned Attestation Card */}
      <div className="flex justify-end w-full">
        <AttestationCard data={data} />
      </div>

      {/* Horizontal Divider Line under Card */}
      <div
        className="w-full mt-3"
        style={{
          borderTop: "1.5px solid #4a687d",
          width: "72%",
          marginLeft: "auto",
          marginRight: "40px",
        }}
      />

      {/* Bottom Footer: Left = Blockchain Verified, Right = Arabic Text & QR Code */}
      <div className="w-full  flex items-center justify-between gap-3">
        {/* Far Left: Blockchain Verified */}
        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ fontSize: "11px", color: "#64748b" }}
        >
          <span style={{ color: "#64748b" }}>Blockchain Verified</span>
          <svg
            className="-mb-4"
            width="20"
            height="20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 5
       C40 5 31 14 18 14
       H12
       V37
       C12 55 23 68 40 75
       C57 68 68 55 68 37
       V14
       H62
       C49 14 40 5 40 5Z"
              stroke="#B5D3A7"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            <path
              d="M27 39L36 48L54 30"
              stroke="#B5D3A7"
              strokeWidth="7"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </div>

        {/* Right Section: Arabic Notice & QR Code */}
        <div className="flex relative z-50 -mt-3 mr-0 items-center gap-3">
          <div className="text-right" dir="rtl">
            <p
              className="font-semibold -mb-1 tracking-wide"
              style={{ fontSize: "13px", color: "#000000" }}
            >
              تصديق بالرقم :{" "}
              <span
                className=" font-normal "
                style={{
                  fontSize: "13.5px",
                  color: "#000000",
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 700,
                }}
              >
                {data.eVerifyNo}
              </span>
            </p>
            <p
              className="mt-0.5 font-semibold leading-normal"
              style={{ fontSize: "12px", color: "#000000" }}
            >
              تم إنجاز المعاملة إلكترونيا و للتأكد من صحة المعاملة يمكنك مسح
              الباركود{" "}
              <span
                className="font-bold"
                dir="ltr"
                style={{
                  color: "#000000",
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 700,
                }}
              >
                (QR Code)
              </span>
            </p>
          </div>

          {/* QR Code */}
          <div className="shrink-0 -mt-2.5 -mr-3 flex items-center justify-center">
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="Verification QR Code"
                style={{
                  width: "75px",
                  border: "5px solid white",
                  height: "75px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  backgroundColor: "#363636",
                  color: "#ffffff",
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
