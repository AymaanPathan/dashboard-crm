import { IQuotation } from "./quotation.model";

export interface ITemplate {
  id?: string;
  companyId?: string | null;
  companyName?: string | null;
  companyEmail?: string | null;
  companyAddress?: string | null;
  gstin?: string | null;
  website?: string | null;

  templateType: "classic" | "modern" | "minimal";
  templateName?: string;

  logoUrl?: string | null;
  headerFont?: string | null;
  brandColor?: string | null;
  signatureUrl?: string | null;
  termsAndConditions?: string | null;
  bankDetails?: Record<string, any> | null;
  defaultNotes?: string | null;

  previewUrl?: string | null;

  createdAt: string;
  updatedAt: string;

  quotations?: IQuotation[];
}
