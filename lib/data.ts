export type ServiceRequest = {
  id: string;
  name: string;
  govFee: number;
  serviceFee: number;
  vatAmount: number;
};

export type ServiceCategory = {
  id: string;
  name: string;
  requests: ServiceRequest[];
};

export type MainService = {
  id: string;
  name: string;
  categories?: ServiceCategory[];
};

const individualRequests: ServiceRequest[] = [
  {
    id: "civil-document-id-card-driving-license-birth-certificate-passport",
    name: "Civil Document - ID Card Driving license birth certificate passport",
    govFee: 10.00,
    serviceFee: 10.00,
    vatAmount: 0.5,
  },
  {
    id: "divorce-certificate",
    name: "Divorce certificate",
    govFee: 20.00,
    serviceFee: 15.00,
    vatAmount: 0.75,
  },
  {
    id: "marriage-certificate",
    name: "Marriage certificate",
    govFee: 10.00,
    serviceFee: 15.00,
    vatAmount: 0.75,
  },
];

const agentRequests: ServiceRequest[] = [
  {
    id: "agent-trade-agencies-original",
    name: "Trade agencies /original (Agent)",
    govFee: 10,
    serviceFee: 20,
    vatAmount: 0.9,
  },
  {
    id: "agent-certificate-of-origin",
    name: "Certificate of origin /original (Agent)",
    govFee: 8,
    serviceFee: 20,
    vatAmount: 0.84,
  },
];

export const mainServices: MainService[] = [
  {
    id: "foreign-ministry-oman",
    name: "Foreign Ministry - Oman",
    categories: [
      {
        id: "agents",
        name: "Foreign Ministry - Oman - Agents",
        requests: agentRequests,
      },
      {
        id: "individuals",
        name: "Foreign Ministry - Oman - Individuals",
        requests: individualRequests,
      },
    ],
  },
  { id: "embassy-uae", name: "Embassy of Oman - UAE" },
  { id: "embassy-kuwait", name: "Embassy of Oman - Kuwait" },
  { id: "embassy-bahrain", name: "Embassy of Oman - Bahrain" },
  { id: "embassy-india", name: "Embassy of Oman - India" },
  { id: "embassy-sri-lanka", name: "Embassy of Oman - Sri Lanka" },
  { id: "embassy-saudi-arabia", name: "Embassy of Oman - Saudi Arabia" },
];

export const branches = [
  "Muscat Main Branch",
  "Salalah Branch",
  "Sohar Branch",
];
export const applyingFromOptions = [
  "Oman",
  "UAE",
  "Saudi Arabia",
  "India",
  "Other",
];
