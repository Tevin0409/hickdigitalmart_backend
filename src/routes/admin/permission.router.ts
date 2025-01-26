import express from "express";

import { permissionController } from "../../controller";
import { authAdminMiddleware } from "../../middleware";

const permissionRouter = express.Router();

permissionRouter.get("/", authAdminMiddleware, permissionController.getAllpermissions);

permissionRouter.post("/create-permission",authAdminMiddleware, permissionController.createpermission);

permissionRouter.patch("/update/:id",authAdminMiddleware, permissionController.updatepermission);

permissionRouter.delete("/delete/:id",authAdminMiddleware, permissionController.deletepermission);

export { permissionRouter };
