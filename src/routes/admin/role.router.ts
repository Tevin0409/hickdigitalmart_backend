import express from "express";

import { roleController } from "../../controller";
import { authAdminMiddleware, validate } from "../../middleware";
import { createRoleSchema } from "../../validators/userValidator";

const roleRouter = express.Router();

roleRouter.get("/", roleController.getAllRoles);

roleRouter.post("/create-role",authAdminMiddleware, validate(createRoleSchema),roleController.createrole);

roleRouter.patch("/update/:id",authAdminMiddleware, roleController.updateRole);

roleRouter.delete("/delete/:id",authAdminMiddleware, roleController.deleteRole);

export { roleRouter };
