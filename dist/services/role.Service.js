import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware";
const prisma = new PrismaClient();
export const roleService = {
    // Create a new role
    createRole: async (roleData) => {
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
        }
        catch (error) {
            throw new AppError(500, "Failed to create role");
        }
    },
    // Get all roles
    getAllRoles: async () => {
        try {
            const roles = await prisma.role.findMany();
            return roles;
        }
        catch (error) {
            throw new AppError(500, "Failed to retrieve roles");
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
        }
        catch (error) {
            throw new AppError(500, "Failed to retrieve roles");
        }
    },
    // Update a role by ID
    updateRole: async (id, roleData) => {
        try {
            const updatedRole = await prisma.role.update({
                where: { id },
                data: roleData,
            });
            return updatedRole;
        }
        catch (error) {
            throw new AppError(500, "Failed to update role");
        }
    },
    // Delete a role by ID
    deleteRole: async (id) => {
        try {
            const deletedRole = await prisma.role.delete({
                where: { id },
            });
            return deletedRole;
        }
        catch (error) {
            throw new AppError(500, "Failed to delete role");
        }
    },
};
