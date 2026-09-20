// @ts-nocheck
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Sanitizes modern CSS colors (oklch, lab, color) in the cloned DOM
 * so html2canvas never encounters unsupported color functions.
 */
function sanitizeModernColors(clonedDoc: Document): void {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const colorProperties = [
    "color",
    "background-color",
    "border-color",
    "border-top-color",
    "border-bottom-color",
    "border-left-color",
    "border-right-color",
    "outline-color",
    "fill",
    "stroke",
    "text-decoration-color",
  ];

  const elements = clonedDoc.querySelectorAll<HTMLElement>("*");
  elements.forEach((el) => {
    if (!el.style) return;
    const computed = window.getComputedStyle(el);

    for (const prop of colorProperties) {
      const val = computed.getPropertyValue(prop);
      if (
        val &&
        (val.includes("lab(") ||
          val.includes("oklch(") ||
          val.includes("color(") ||
          val.includes("hwb("))
      ) {
        if (ctx) {
          try {
            ctx.fillStyle = "#ffffff";
            ctx.fillStyle = val;
            el.style.setProperty(prop, ctx.fillStyle, "important");
          } catch {
            el.style.setProperty(
              prop,
              prop.includes("color") && !prop.includes("background")
                ? "#0f172a"
                : "#ffffff",
              "important"
            );
          }
        }
      }
    }
  });
}

let embeddedArabicFont: { name: string; uri: string; format: string } | null = null;

async function getArabicFontDataUri(): Promise<{ name: string; uri: string; format: string } | null> {
  if (embeddedArabicFont) return embeddedArabicFont;

  const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // 1. Try Google Fonts Scheherazade New Bold (700)
  try {
    const res = await fetch(
      "https://fonts.gstatic.com/s/scheherazadenew/v21/4UaerFhTvxVnHDvUkUiHg8jprP4DM79DLlQI-aCksSC1rw.woff2"
    );
    if (res.ok) {
      const blob = await res.blob();
      const uri = await blobToDataUrl(blob);
      embeddedArabicFont = { name: "Scheherazade New", uri, format: "woff2" };
      return embeddedArabicFont;
    }
  } catch (e) {
    console.warn("Could not fetch remote Scheherazade New font:", e);
  }

  // 2. Fallback to local Traditional Arabic Bold TTF in public/fonts
  try {
    const res = await fetch("/fonts/tradbdo.ttf");
    if (res.ok) {
      const blob = await res.blob();
      const uri = await blobToDataUrl(blob);
      embeddedArabicFont = { name: "Traditional Arabic", uri, format: "truetype" };
      return embeddedArabicFont;
    }
  } catch (e) {
    console.warn("Could not fetch local Traditional Arabic font:", e);
  }

  return null;
}

/**
 * Generates an official Attestation PDF (single or multi-page)
 */
export async function generateAttestationPdf(
  elementIds: string | string[],
  fileName: string = "Oman_Attestation_Document.pdf"
): Promise<void> {
  const ids = Array.isArray(elementIds) ? elementIds : [elementIds];
  if (ids.length === 0) {
    throw new Error("No element IDs provided for PDF generation");
  }

  // Fetch font as data URI for 100% reliable canvas embedding
  const fontData = await getArabicFontDataUri();

  // Ensure fonts and images are ready
  if (document.fonts) {
    try {
      if (fontData) {
        const fontFace = new FontFace(fontData.name, `url(${fontData.uri})`, {
          weight: "700",
          style: "normal",
        });
        await fontFace.load();
        document.fonts.add(fontFace);
      }
      await Promise.all([
        document.fonts.load('400 12px "Traditional Arabic"'),
        document.fonts.load('700 12px "Traditional Arabic"'),
        document.fonts.load('400 12px "Scheherazade New"'),
        document.fonts.load('700 12px "Scheherazade New"'),
      ]);
    } catch (e) {
      console.warn("Font preloading notice:", e);
    }
    await document.fonts.ready;
  }

  // Wait a brief moment for QR code render or image decoding
  await new Promise((resolve) => setTimeout(resolve, 250));

  // A4 Portrait: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

  let renderedPageCount = 0;

  for (const id of ids) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with id "${id}" not found, skipping`);
      continue;
    }

    // Render element to high-resolution canvas with onclone color sanitizer
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1200,
      onclone: (clonedDoc) => {
        sanitizeModernColors(clonedDoc);

        if (fontData) {
          const style = clonedDoc.createElement("style");
          style.textContent = `
            @font-face {
              font-family: '${fontData.name}';
              src: url('${fontData.uri}') format('${fontData.format}');
              font-weight: 700;
              font-style: normal;
            }
            .scheherazade-arabic-text, [data-scheherazade] {
              font-family: '${fontData.name}', serif !important;
              letter-spacing: 0px !important;
              display: inline-block !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          const elements = clonedDoc.querySelectorAll<HTMLElement>(
            ".scheherazade-arabic-text, [data-scheherazade]"
          );
          elements.forEach((el) => {
            el.style.setProperty("font-family", `'${fontData.name}', serif`, "important");
            el.style.setProperty("letter-spacing", "0px", "important");
          });
        }
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    if (renderedPageCount > 0) {
      pdf.addPage("a4", "portrait");
    }

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    renderedPageCount++;
  }

  if (renderedPageCount === 0) {
    throw new Error("Could not find any printable elements to generate PDF.");
  }

  // Save the generated PDF to user's computer
  pdf.save(fileName);

  // Return the PDF Blob so it can be sent to the backend
  return pdf.output("blob");
}
