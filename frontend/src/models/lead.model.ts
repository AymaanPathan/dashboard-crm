export interface Lead {
  position: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  budget: string;
  notes: string;
  leadType: string;
  contactPersonName: string;
  category: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  organizationId: string;

  assignedToId: string;
}

export interface Status {
  name: string;
  leadIds?: string[];
}

export interface LeadState {
  leads: any;
  statuses: Status[];
  loading: boolean;
  error: string | null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}
