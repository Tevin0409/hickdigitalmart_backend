import express from "express";

import { roleController } from "../../controller";
import { authMiddleware } from "../../middleware";

const roleRouter = express.Router();

roleRouter.get("/", authMiddleware, roleController.getAllRoles);

roleRouter.post("/create-role", roleController.createrole);

roleRouter.patch("/update/:id",authMiddleware, roleController.updateRole);

roleRouter.delete("/delete/:id",authMiddleware, roleController.deleteRole);

export { roleRouter };
