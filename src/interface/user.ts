export interface CreateUserDTO {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  roleId: string;
}
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RoleDTO {
  name: string;
  description: string;
}

export interface TechnicianDTO {
  businessName: string;
  phoneNumber: string;
  email: string;
  location: string;
  businessType: string;
  experienceYears: number | null;
  experienceAreas: string[];
  brandsWorkedWith: string[];
  integrationExperience: string;
  purchaseSource: string[];
  purchaseHikvision: string;
  requiresTraining: string;
}
