import { ICreateTemplatePayload } from "./template.model";

export interface IQuotationItem {
  description: string;
  quantity: number;
  price: number;
}

export interface ICustomerInfo {
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface IOrderDetails {
  items: IQuotationItem[];
  taxRate: number;
  validUntil: string; // ISO string
  quoteNumber: string;
}

export interface ICreateQuotationPayload {
  quotationName: string;
  templateType?: string | null;

  customerInfo: ICustomerInfo;
  orderDetails: IOrderDetails;

  isOrder?: boolean;

  createdAt?: string;
  updatedAt?: string;

  template?: ICreateTemplatePayload | null;
}
