import { ICreateTemplatePayload } from "./template.model";

export interface CompanyInfo {
  website?: string;
  gstin: string;
  email: string;
  name: string;
  address: string;
  phone: string;
}

export interface ICustomerInfo {
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface IQuotationItem {
  description: string;
  quantity: number;
  price: number;
}

export interface IOrderDetails {
  items: IQuotationItem[];
  taxRate: number;
  validUntil: string; // ISO string
  quoteNumber: string;
}

export interface Config {
  termsAndConditions: string[];
  bankDetails: any;
  brandColor?: string;
  accentColor?: string;
  headerFont?: string;
}

export interface ICreateQuotationPayload {
  companyId: string;
  templateId?: string | null;
  quotationName?: string | null;

  customerName: string;
  customerCompany?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;

  items: Record<string, any>;

  subtotal: number;
  tax: number;
  total: number;

  validUntil: string;
  quoteNumber: string;
  isOrder: boolean;

  createdAt: string;
  updatedAt: string;

  template?: ICreateTemplatePayload | null;
}
