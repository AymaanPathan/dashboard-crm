import { IKanbanLoadingState } from "./loadings.model";

export interface ILead {
  name: string;
  email: string;
  mobileNumber: string;
  source: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  leadType: string;
  contactPersonName: string;
  requirements?: string;
  assignedToId: string;
  stageId?: string;
  createdBy?: string;
  organizationId?: string;
  id?: string;
  position?: number;
  stage?: string;
}

export interface Status {
  stageId: string;
  stageName: string;
  leads?: string[];
}

export interface KanbanState {
  leads: ILead[];
  statuses: Status[];
  kanbanData: any[];
  loading: IKanbanLoadingState;
  error: string | null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}
