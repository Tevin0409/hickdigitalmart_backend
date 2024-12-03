import express from "express";

import { permissionController } from "../../controller";
import { authMiddleware } from "../../middleware";

const permissionRouter = express.Router();

permissionRouter.get("/", authMiddleware, permissionController.getAllpermissions);

permissionRouter.post("/create-permission",authMiddleware, permissionController.createpermission);

permissionRouter.patch("/update/:id",authMiddleware, permissionController.updatepermission);

permissionRouter.delete("/delete/:id",authMiddleware, permissionController.deletepermission);

export { permissionRouter };
