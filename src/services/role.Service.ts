import { PrismaClient } from "@prisma/client";
import { RoleDTO } from "../interface/user"; 
import { AppError } from "../middleware";  

const prisma = new PrismaClient();

export const roleService = {
  // Create a new role
  createRole: async (roleData: RoleDTO) => {
    try {
      const role = await prisma.role.create({
        data: {
          name: roleData.name,
          description: roleData.description,  
        },
      });
      return role;
    } catch (error) {
      throw new AppError( 500,"Failed to create role ");
    }
  },

  // Get all roles
  getAllRoles: async () => {
    try {
      const roles = await prisma.role.findMany();
      return roles;
    } catch (error) {
      throw new AppError(500,"Failed to retrieve roles"); 
    }
  },

  // Update a role by ID
  updateRole: async (id: string, roleData: Partial<RoleDTO>) => {
    try {
      const updatedRole = await prisma.role.update({
        where: { id },
        data: roleData,
      });
      return updatedRole;
    } catch (error) {
      throw new AppError(500,"Failed to update role"); 
    }
  },

  // Delete a role by ID
  deleteRole: async (id: string) => {
    try {
      const deletedRole = await prisma.role.delete({
        where: { id },
      });
      return deletedRole;
    } catch (error) {
      throw new AppError(500,"Failed to delete role");
    }
  },
};

