export interface IPdf {
  applicantName: string;
  applyingFrom: string;
  approverName: string;
  branch: string;
  dateOfAttestation: string;
  documents?: FileList | File[] | Blob | File;
  originalPdf?: FileList | File[] | Blob | File;
  eVerifyNo: string;
  email: string;
  phoneNumber: string;
  taxRegistrationNumber?: string;
  verifyAt: string;
  verifyBy: string;
  documentName: string;
  transactionDate: string;
  totalPayment: string;
  paymentId: string;
}
