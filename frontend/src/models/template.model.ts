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
