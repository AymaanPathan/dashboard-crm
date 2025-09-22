import { ITemplate } from "./template.model";

export interface IQuotation {
  id: string;
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

  template?: ITemplate | null;
}
