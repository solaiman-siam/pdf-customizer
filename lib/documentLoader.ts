/**
 * Helper to convert uploaded File (image or PDF) to an Image Data URL
 */
export async function fileToDataUrl(file: File): Promise<string> {
  // If image
  if (file.type.startsWith("image/")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // If PDF
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      
      // Configure worker if needed
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);

      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const canvasContext = canvas.getContext("2d");
      if (!canvasContext) throw new Error("Canvas context could not be created");

      await (page.render({
        canvasContext,
        viewport,
      }) as any).promise;

      return canvas.toDataURL("image/png");
    } catch (pdfErr) {
      console.warn("Failed to render PDF page via pdfjs-dist, falling back to object URL:", pdfErr);
      return URL.createObjectURL(file);
    }
  }

  // Default fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
