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
      style={{ width: "70px" }}
    >
      <Image
        src={images.OmanLogo}
        alt="Oman Seal"
        width={800}
        height={800}
        className=" w-full h-auto  object-contain "
        style={{ display: "block" }}
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
      className={`relative translate-y-1.5 mr-2 ${carlito.className} ${className}  pb-7`}
      style={{
        width: "330px",
        backgroundColor: "#ffffff",
        border: "1.5px solid #9e9da1",
        color: "#0f172a",
        fontFamily:
          "var(--font-carlito), Carlito, Arial, Helvetica, sans-serif",
      }}
    >
      {/* Outer Border Box */}
      <div style={{}}>
        {/* Top Gold / Ochre Banner */}
        <div
          className="mx-auto -mt-3 tracking-normal px-3 text-center h-fit flex flex-col items-center"
          style={{
            width: "92%",
          }}
        >
          <Image
            style={{ display: "block" }}
            src={images.TopBanner}
            className="w-full rounded-[1px] object-contain h-auto"
            alt="Top Banner"
            width={320}
            height={80}
          />
        </div>
        {/* Main Card Row: Seal + Table */}
        <div className=" flex relative  z-50 items-center gap-3">
          {/* Left Seal */}
          <div
            className="shrink-0 top-1/2 -translate-y-1/2  -left-18 flex absolute justify-center pl-0.5"
            style={{ width: "138px" }}
          >
            <OmanSeal />
          </div>

          {/* Center/Right Table */}
          <div className="flex-1 -mt-2.5 pl-8.5  pr-1">
            <table
              className="w-full border-collapse"
              style={{ fontSize: "9.2px" }}
            >
              <tbody style={{ transform: "scaleY(0.95)" }}>
                <tr>  
                  <td
                    className=" text-left text-[9px]! font-extrabold whitespace-nowrap"
                    style={{ width: "55px", color: "#010000" }}
                  >
                    e-Verify No
                  </td>
                  <td
                    className=" px-1.5 text-left  text-nowrap font-extrabold"
                    style={{ color: "#010000", width: "140px" }}
                  >
                    {data.eVerifyNo}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top translate-y-0.5"
                    style={{
                      color: "#000000",
                      fontFamily: "Noto Sans Arabic",
                      fontWeight: 700,
                      fontSize: "7.5px",
                    }}
                    dir="rtl"
                  >
                    رقم التصديق
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left font-extrabold whitespace-nowrap"
                    style={{ color: "#010000" }}
                  >
                    Verify By
                  </td>
                  <td
                    className=" px-1.5 text-left font-bold"
                    style={{ color: "#010000", width: "140px" }}
                  >
                    {data.verifyBy}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top translate-y-0.5"
                    style={{
                      color: "#000000",
                      fontFamily: "Noto Sans Arabic",
                      fontWeight: 700,
                      fontSize: "7.5px",
                    }}
                    dir="rtl"
                  >
                    تم التحقق من قبل
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left font-bold whitespace-nowrap"
                    style={{ color: "#010000" }}
                  >
                    Verify at
                  </td>
                  <td
                    className=" px-1.5 text-left font-bold"
                    style={{ color: "#010000", width: "150px" }}
                  >
                    {data.verifyAt}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top translate-y-0.5"
                    style={{
                      color: "#000000",
                      fontFamily: "Noto Sans Arabic",
                      fontWeight: 700,
                      fontSize: "7.5px",
                    }}
                    dir="rtl"
                  >
                    تم التحقق في
                  </td>
                </tr>

                <tr >
                  <td
                    className=" text-wrap pb-0.5 leading-2.75 text-left justify-start font-bold whitespace-nowrap"
                    style={{ color: "#010000" }}
                  >
                    Applicant <br />
                    Name
                  </td>
                  <td
                    className=" px-1.5 flex text-left justify-start text-nowrap font-bold uppercase"
                    style={{ color: "#010000", width: "140px" }}
                  >
                    {data.applicantName}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top translate-y-0.5"
                    style={{
                      color: "#000000",
                      fontFamily: "Noto Sans Arabic",
                      fontWeight: 700,
                      fontSize: "7.5px",
                    }}
                    dir="rtl"
                  >
                    اسم العميل
                  </td>
                </tr>

                <tr className="">
                  <td
                    className=" text-left leading-2.75 font-bold align-top whitespace-nowrap"
                    style={{ color: "#010000" }}
                  >
                    Document <br /> Name
                  </td>
                  <td
                    className=" px-1.5 flex text-left w-full font-bold align-top leading-snug"
                    style={{ color: "#010000", width: "140px" }}
                  >
                    {data.documentName}
                  </td>
                  <td
                    className=" text-left font-bold align-top translate-y-0.5 "
                    style={{
                      color: "#000000",
                      fontFamily: "Noto Sans Arabic",
                      fontWeight: 700,
                      fontSize: "7.5px",
                    }}
                    dir="rtl"
                  >
                    اسم الوثيقة
                  </td>
                </tr>

                <tr className="">
                  <td
                    className=" text-left pb-0.5 leading-2.75 h-fit font-bold "
                    style={{ color: "#010000" }}
                  >
                    Date of <br /> Attestation
                  </td>
                  <td
                    className=" px-1.5 text-left flex text-nowrap font-bold"
                    style={{ color: "#010000", width: "140px" }}
                  >
                    {data.dateOfAttestation}
                  </td>
                  <td
                    className=" text-left font-bold align-top translate-y-0.5"
                    style={{
                      color: "#000000",
                      fontFamily: "Noto Sans Arabic",
                      fontWeight: 700,
                      fontSize: "7.5px",
                    }}
                    dir="rtl"
                  >
                    تاريخ التصديق
                  </td>
                </tr>

                <tr>
                  <td
                    className=" text-left leading-2.75 font-bold whitespace-nowrap"
                    style={{ color: "#010000", fontWeight: 700 }}
                  >
                    Approver <br /> Name
                  </td>
                  <td
                    className=" px-1.5 text-left flex font-bold"
                    style={{ color: "#010000", width: "140px" ,  fontWeight: 700 }}
                  >
                    {data.approverName}
                  </td>
                  <td
                    className=" text-left font-bold whitespace-nowrap align-top translate-y-0.5"
                    style={{
                      color: "#000000",
                      fontFamily: "Noto Sans Arabic",
                     
                      fontWeight: 700,
                      fontSize: "7.5px",
                    }}
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
        className="w-full  mt-1.5 translate-y-1.5 "
        style={{
          borderTop: "1.5px solid #383838",
          width: "60%",
          marginLeft: "auto",
          marginRight: "40px",
        }}
      />

      {/* Bottom Footer: Left = Blockchain Verified, Right = Arabic Text & QR Code */}
      <div className="w-full flex items-center justify-between gap-3">
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
        <div className="flex relative z-50  mr-0 items-center gap-3">
          <div className="text-right -mt-6" dir="rtl">
            <p
              className="font-semibold tracking-wide"
              style={{ fontSize: "12px", color: "#000000", fontWeight: 700 }}
            >
              بالرقم تصدیق
              <span> : </span>
              <span
                className=" font-normal "
                style={{
                  fontSize: "12px",
                  color: "#000000",
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 700,
                  transform: "scaleY(0.95)",
                }}
              >
                {data.eVerifyNo}
              </span>
              
            </p>
            <p
              className="-mt-0.5 font-semibold leading-normal"
              style={{ fontSize: "12px", color: "#000000" }}
            >
              تم إنجاز المعاملة إلكترونیا و للتأكد من صحة المعاملة یمكنك مسح
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
          <div className="shrink-0 -mt-2 -mr-3 flex items-center justify-center">
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="Verification QR Code"
                style={{
                  width: "65px",
                  border: "4px solid white",
                  height: "65px",
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
