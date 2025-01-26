import express from "express";

import { roleController } from "../../controller";
import { authMiddleware, validate } from "../../middleware";
import { createRoleSchema } from "../../validators/userValidator";

const roleRouter = express.Router();

roleRouter.get("/", authMiddleware, roleController.getAllRoles);

roleRouter.post("/create-role", validate(createRoleSchema),roleController.createrole);

roleRouter.patch("/update/:id",authMiddleware, roleController.updateRole);

roleRouter.delete("/delete/:id",authMiddleware, roleController.deleteRole);

export { roleRouter };
