import { IPdf } from "../types/pdfType";

export const getPdfList = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pdf/pdf-list`);
  const data = await response.json();
  return data;
};

export const submitPdf = async (pdfData: IPdf | FormData) => {
  let body: FormData;

  if (pdfData instanceof FormData) {
    body = pdfData;
  } else {
    body = new FormData();
    Object.entries(pdfData).forEach(([key, value]) => {
      if (!value) return;

      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          body.append(key, file);
        });
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File || item instanceof Blob) {
            body.append(key, item);
          } else {
            body.append(key, String(item));
          }
        });
      } else if (value instanceof File || value instanceof Blob) {
        body.append(key, value);
      } else {
        body.append(key, String(value));
      }
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pdf/create-pdf`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to create PDF. Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const getPdfDetails = async (eVerifyNo: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pdf/pdf-list/${eVerifyNo}`)
  const data = await response.json()
  return data
}