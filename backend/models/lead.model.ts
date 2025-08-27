export interface ILead {
  name: string;
  email?: string;
  mobileNumber?: string;
  source?: string;
  address?: IAddress;
  contactPersonName?: string;
  category?: string;
  requirements?: string;
  assignedToId?: string;
  organizationId: string;
  status?: string;
  createdBy?: string;
}
interface IAddress {
  line1?: string;
  city?: string;
  state?: string;
  district?: string;
  pincode?: string;
}
