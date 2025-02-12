import { permissionService } from "../services";
export const permissionController = {
    // Get all permissions
    getAllpermissions: async (req, res, next) => {
        try {
            const permissions = await permissionService.getAllPermissions();
            res.status(200).json(permissions);
        }
        catch (error) {
            next(error);
        }
    },
    // Create a new permission
    createpermission: async (req, res, next) => {
        try {
            const data = req.body;
            const permission = await permissionService.createPermission(data);
            res.status(201).json(permission);
        }
        catch (error) {
            next(error);
        }
    },
    updatepermission: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedpermission = await permissionService.updatePermission(id, data);
            if (!updatedpermission) {
                res.status(404).json({ message: "permission not found" });
                return;
            }
            res.status(200).json(updatedpermission);
            return;
        }
        catch (error) {
            next(error);
        }
    },
    // Delete a permission by ID
    deletepermission: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleted = await permissionService.deletePermission(id);
            if (!deleted) {
                res.status(404).json({ message: "permission not found" });
                return;
            }
            res.status(200).json({ message: "permission deleted successfully" });
            return;
        }
        catch (error) {
            next(error);
        }
    },
};
