import { ICreateTemplatePayload } from "./template.model";

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
  validUntil: string;
  quoteNumber: string;
}

export interface ICreateQuotationPayload {
  tax?: number;
  lead: string;
  templateType?: string | null;
  customerInfo: ICustomerInfo;
  orderDetails: IOrderDetails;

  subtotal?: number;
  total?: number;
  validUntil?: string | number | Date;
  pdfUrl?: string;
  customerName?: string;
  quoteNumber?: string;
  id?: string;
  quotationName?: string;

  isOrder?: boolean;

  createdAt?: string;
  updatedAt?: string;

  template?: ICreateTemplatePayload | null;
}
