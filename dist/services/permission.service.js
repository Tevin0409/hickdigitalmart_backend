"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionService = void 0;
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const prisma = new client_1.PrismaClient();
exports.permissionService = {
    // Create a new permission
    createPermission: async (permissionData) => {
        try {
            const permissionName = permissionData.name.toUpperCase();
            const existingPermission = await prisma.permission.findFirst({
                where: { name: permissionName },
            });
            if (existingPermission) {
                throw new middleware_1.AppError(400, "Permission name already exists");
            }
            const permission = await prisma.permission.create({
                data: {
                    name: permissionName,
                    description: permissionData.description,
                },
            });
            return permission;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to create permission");
        }
    },
    // Get all permissions
    getAllPermissions: async () => {
        try {
            const permissions = await prisma.permission.findMany();
            return permissions;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve permissions");
        }
    },
    // Update a permission by ID
    updatePermission: async (id, permissionData) => {
        try {
            const updatedpermission = await prisma.permission.update({
                where: { id },
                data: permissionData,
            });
            return updatedpermission;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to update permission");
        }
    },
    // Delete a permission by ID
    deletePermission: async (id) => {
        try {
            const deletedpermission = await prisma.permission.delete({
                where: { id },
            });
            return deletedpermission;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to delete permission");
        }
    },
};
