export interface ICreateTemplatePayload {
  templateType: "classic" | "modern" | "minimal";
  templateName: string;
  headerFont: string;
  logoUrl?: string;
  brandColor?: string;
  termsAndConditions?: string;
  defaultNotes?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gstin: string;
    website: string;
  };
}

export interface CompanyInfo {
  website: string;
  gstin: string;
  email: string;
  logo: any;
  name: string;
  address: string;
  phone: string;
}

export interface ICustomerInfo {
  gstin: any;
  address: any;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface OrderDetails {
  deliveryTime: string;
  paymentTerms: string;
  validUntil: string;
  quoteNumber: string;
  date: string;
  items: Array<{
    hsn: string;
    details: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  taxRate?: number;
}

export interface Config {
  signature: any;
  termsAndConditions: string;
  bankDetails: any;
  brandColor?: string;
  accentColor?: string;
  headerFont?: string;
}
