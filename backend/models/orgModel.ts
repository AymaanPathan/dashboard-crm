import { IUser } from "./user.model";

export interface IOrganization {
  id: string;
  ownerId: string;
  organization_name: string;
  company_website: string | null;
  industry: string;
  company_size: string;
  createdAt: Date;
  updatedAt: Date;
  employees: IUser[];
  owner: IUser | null;
}
