"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleController = void 0;
const services_1 = require("../services");
exports.roleController = {
    // Get all roles
    getAllRoles: async (req, res, next) => {
        try {
            const roles = await services_1.roleService.getAllRoles();
            res.status(200).json(roles);
        }
        catch (error) {
            next(error);
        }
    },
    getUserRoles: async (req, res, next) => {
        try {
            const roles = await services_1.roleService.getUserRoles();
            res.status(200).json(roles);
        }
        catch (error) {
            next(error);
        }
    },
    // Create a new role
    createrole: async (req, res, next) => {
        try {
            const data = req.body;
            const role = await services_1.roleService.createRole(data);
            res.status(201).json(role);
        }
        catch (error) {
            next(error);
        }
    },
    updateRole: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedRole = await services_1.roleService.updateRole(id, data);
            if (!updatedRole) {
                res.status(404).json({ message: "Role not found" });
                return;
            }
            res.status(200).json(updatedRole);
            return;
        }
        catch (error) {
            next(error);
        }
    },
    // Delete a role by ID
    deleteRole: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleted = await services_1.roleService.deleteRole(id);
            if (!deleted) {
                res.status(404).json({ message: "Role not found" });
                return;
            }
            res.status(200).json({ message: "Role deleted successfully" });
            return;
        }
        catch (error) {
            next(error);
        }
    },
};
