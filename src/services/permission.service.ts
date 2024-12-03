import { PrismaClient } from "@prisma/client";
import { RoleDTO } from "../interface/user"; 
import { AppError } from "../middleware";  

const prisma = new PrismaClient();

export const permissionService = {
  // Create a new permission
  createPermission: async (permissionData: RoleDTO) => {
    try {
      const permission = await prisma.permission.create({
        data: {
          name: permissionData.name,
          description: permissionData.description,  
        },
      });
      return permission;
    } catch (error) {
      throw new AppError( 500,"Failed to create permission");
    }
  },

  // Get all permissions
  getAllPermissions: async () => {
    try {
      const permissions = await prisma.permission.findMany();
      return permissions;
    } catch (error) {
      throw new AppError(500,"Failed to retrieve permissions"); 
    }
  },

  // Update a permission by ID
  updatePermission: async (id: string, permissionData: Partial<RoleDTO>) => {
    try {
      const updatedpermission = await prisma.permission.update({
        where: { id },
        data: permissionData,
      });
      return updatedpermission;
    } catch (error) {
      throw new AppError(500,"Failed to update permission"); 
    }
  },

  // Delete a permission by ID
  deletePermission: async (id: string) => {
    try {
      const deletedpermission = await prisma.permission.delete({
        where: { id },
      });
      return deletedpermission;
    } catch (error) {
      throw new AppError(500,"Failed to delete permission");
    }
  },
};

