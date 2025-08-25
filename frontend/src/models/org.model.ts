import { IUser } from "./user.model";

interface Status {
  name: string;
  leadIds: string[];
}

export interface IOrganization {
  id: string;
  ownerId?: string;
  organization_name: string;
  company_website: string | null;
  industry: string;
  company_size: string;
  employees: IUser[];
  owner?: IUser | null;
  createdAt?: Date;
  updatedAt?: Date;
  statuses?: Status | null;
}
