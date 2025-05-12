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
  experienceYears: string | null;
  experienceAreas: string[];
  brandsWorkedWith: string[];
  integrationExperience: string;
  purchaseSource: string[];
  purchaseHikvision: string;
  requiresTraining: string;
}

export interface ShopOwnerDTO {
  companyName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneNumber2?: string | null;
  email: string;
  email2?: string | null;
  address: string;
  selectedBusinessType: string;
  selectedBrands: string[];
  selectedSecurityBrands: string[];
  otherBrand?: string | null;
  selectedCategories: string[];
  hikvisionChallenges?: string | null;
  adviceToSecureDigital?: string | null;
}

