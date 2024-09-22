import { Gender, HealthStatus, PetSize } from "@prisma/client";

export interface IPet {
  name: string;
  image: string;
  birthDate?: Date;
  description?: string;
  gender: Gender;
  age: number;
  breed: string;
  weight: number;
  height: number;
  color: string;
  size: PetSize;
  healthStatus: HealthStatus;
  specialNeeds?: string;
  location?: string;
  publisherId: string;
}
