export interface IUser {
  username: boolean;
  email?: string;
  password: string;
  role: string;
  managerId?: string;
  currentOrganizationId?: string;
  isVerified?: boolean;
}
