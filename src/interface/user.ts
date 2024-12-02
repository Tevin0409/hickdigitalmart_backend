export interface CreateUserDTO {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RoleDTO {
  name: string;
  description: string;
}
