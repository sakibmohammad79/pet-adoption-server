export interface Admin {
  name: string;
  email: string;
  contactNumber: string;
  address?: string | undefined | null;
}
export interface IAdminPayload {
  password: string;
  admin: Admin;
}
