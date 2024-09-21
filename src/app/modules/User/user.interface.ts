import { Gender } from "@prisma/client";

export interface Admin {
  firstName: string;
  lastName: string;
  birthDate?: string | Date;
  gender?: Gender;
  profilePhoto?: string;
  email: string;
  contactNumber?: string;
  address?: string;
}
export interface IAdminPayload {
  password: string;
  admin: Admin;
}
