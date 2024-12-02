import express from "express";

import { roleController } from "../controller";

const roleRouter = express.Router();

roleRouter.get("/", roleController.getAllRoles);

roleRouter.post("/create-role", roleController.createrole);

roleRouter.patch ("/update/:id", roleController.updateRole);

roleRouter.delete("/delete/:id", roleController.deleteRole);

export { roleRouter };