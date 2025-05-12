import { PrismaClient } from "@prisma/client";
import { RoleDTO } from "../interface/user";
import { AppError } from "../middleware";

const prisma = new PrismaClient();

export const roleService = {
  // Create a new role
  createRole: async (roleData: RoleDTO) => {
    try {
      const roleName = roleData.name.toUpperCase();

      const existingRole = await prisma.role.findFirst({
        where: { name: roleName },
      });

      if (existingRole) {
        throw new AppError(400, "Role name already exists");
      }
      const role = await prisma.role.create({
        data: {
          name: roleName,
          description: roleData.description,
        },
      });

      return role;
    } catch (error) {
      throw new AppError(500, "Failed to create role");
    }
  },

  // Get all roles
  getAllRoles: async () => {
    try {
      const roles = await prisma.role.findMany();
      return roles;
    } catch (error) {
      throw new AppError(500, "Failed to retrieve roles");
    }
  },

  //get Role by Name
  getRoleByName: async (name: string) => {
    try {
      const role = await prisma.role.findFirst({
        where: { name: name.toUpperCase() },
      });
      if (!role) {
        throw new AppError(404, "Role not found");
      }
      return role;
    } catch (error) {
      throw new AppError(500, "Failed to retrieve role");
    }
  },
  getUserRoles: async () => {
    try {
      const roles = await prisma.role.findMany({
        where: {
          NOT: [
            { name: 'SUDO' },
            { name: 'ADMIN' },
          ], // Exclude SUDO and ADMIN roles
        },
      });
      return roles;
    } catch (error) {
      throw new AppError(500, "Failed to retrieve roles");
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
      throw new AppError(500, "Failed to update role");
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
      throw new AppError(500, "Failed to delete role");
    }
  },
};
