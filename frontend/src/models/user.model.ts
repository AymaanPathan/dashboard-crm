export interface IUser {
  id?: string;
  username: string;
  email?: string;
  password: string;
  role: string;
  managerId?: string;
  currentOrganizationId?: string;
  isVerified?: boolean;
}
