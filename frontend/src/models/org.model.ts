import { IUser } from "./user.model";

export interface Statusdata {
  leads: any;
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

  statuses?: Statusdata[] | null;
}
