export interface ILead {
  name: string;
  email?: string;
  mobileNumber?: string;
  source?: string;
  address?: IAddress;
  contactPersonName?: string;
  category?: string;
  requirements?: string;
  leadType?: string;
  assignedToId?: string;
  organizationId: string;
  status?: string;
  createdBy?: string;
  position?: number;
}
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface LeadFilter {
  search?: string;
  stageId?: string;
  assignedToId?: string;
  source?: string;
  leadType?: string;
}

export interface LeadStats {
  totalLeads?: number;
  currentMonthLeads?: number;
  lastMonthLeads?: number;
  percentGrowth?: number;
  percentWon?: number;
  wonLeads?: number;
  wonPercentGrowth?: number;
}
