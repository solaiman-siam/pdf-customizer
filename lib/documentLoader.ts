// @ts-ignore
// @ts-nocheck

/**
 * Converts a single File or multiple Files (images or multi-page PDFs) into an array of Image Data URLs (one per page)
 */
export async function filesToDataUrls(files: FileList | File[]): Promise<string[]> {
  const fileArray = Array.isArray(files) ? files : Array.from(files);
  const results: string[] = [];

  for (const file of fileArray) {
    // If PDF
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjsLib = await import("pdfjs-dist");

        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const canvasContext = canvas.getContext("2d");
          if (canvasContext) {
            await (page.render({
              canvasContext,
              viewport,
            }) as any).promise;
            results.push(canvas.toDataURL("image/png"));
          }
        }
      } catch (pdfErr) {
        console.warn("Failed to render PDF page via pdfjs-dist, falling back to object URL:", pdfErr);
        results.push(URL.createObjectURL(file));
      }
    } else if (file.type.startsWith("image/")) {
      // If image
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
      results.push(dataUrl);
    } else {
      // Fallback
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
      results.push(dataUrl);
    }
  }

  return results;
}

/**
 * Helper to convert uploaded File (image or PDF) to an Image Data URL
 */
export async function fileToDataUrl(file: File): Promise<string> {
  const urls = await filesToDataUrls([file]);
  return urls[0] || "";
}
