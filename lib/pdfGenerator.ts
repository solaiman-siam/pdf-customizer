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

export async function generateAttestationPdf(
  elementId: string,
  fileName: string = "Oman_Attestation_Document.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Ensure fonts and images are ready
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Wait a brief moment for QR code render or image decoding
  await new Promise((resolve) => setTimeout(resolve, 250));

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
    },
  });

  const imgData = canvas.toDataURL("image/png", 1.0);

  // A4 Portrait: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

  // Save the generated PDF
  pdf.save(fileName);
}
