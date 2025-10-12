// API configuration and helper functions
const API_BASE_URL ='https://procurewise-1.onrender.com';

export interface RFP {
  _id?: string;
  title: string;
  description: string;
  items: string[];
  deadline: string;
  status?: 'open' | 'closed';
  createdAt?: string;
}

export interface Quotation {
  _id?: string;
  rfpId: string;
  vendorName: string;
  cost: number;
  deliveryTime: number;
  notes?: string;
  score?: number;
  createdAt?: string;
}

export interface VendorScore {
  vendorName: string;
  score: number;
  cost: number;
  deliveryTime: number;
  reasoning?: string;
}

export interface ContractAudit {
  text: string;
  riskFlags: string[];
  insights: string[];
}

// RFP APIs
export const fetchRFPs = async (): Promise<RFP[]> => {
  const response = await fetch(`${API_BASE_URL}/api/rfps`);
  if (!response.ok) throw new Error('Failed to fetch RFPs');
  return response.json();
};

export const createRFP = async (rfp: Omit<RFP, '_id'>): Promise<RFP> => {
  const response = await fetch(`${API_BASE_URL}/api/rfps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rfp),
  });
  if (!response.ok) throw new Error('Failed to create RFP');
  return response.json();
};

// Quotation APIs
export const fetchQuotations = async (rfpId?: string): Promise<Quotation[]> => {
  const url = rfpId 
    ? `${API_BASE_URL}/api/quotations?rfpId=${rfpId}`
    : `${API_BASE_URL}/api/quotations`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch quotations');
  return response.json();
};

export const createQuotation = async (quotation: Omit<Quotation, '_id'>): Promise<Quotation> => {
  const response = await fetch(`${API_BASE_URL}/api/quotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quotation),
  });
  if (!response.ok) throw new Error('Failed to create quotation');
  return response.json();
};

// Vendor Score API
export const fetchVendorScore = async (rfpId: string): Promise<VendorScore> => {
  const response = await fetch(`${API_BASE_URL}/api/vendor-score?rfpId=${rfpId}`);
  if (!response.ok) throw new Error('Failed to fetch vendor score');
  return response.json();
};

// Contract Audit API
export const auditContract = async (text: string): Promise<ContractAudit> => {
  const response = await fetch(`${API_BASE_URL}/api/contract-audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Failed to audit contract');
  return response.json();
};
