export interface Lead {
  stageId: string;
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
  stageId: string;
  stageName: string;
  leads?: string[];
}

export interface LeadState {
  leads: any;
  statuses: Status[];
  kanbanData: any[];
  loading: boolean;
  error: string | null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}
