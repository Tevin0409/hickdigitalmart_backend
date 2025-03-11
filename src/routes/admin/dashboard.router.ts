import express from "express";

import { authAdminMiddleware } from "../../middleware";
import { dashboardController } from "../../controller";

const dashboardRouter = express.Router();

dashboardRouter.get("/", authAdminMiddleware, dashboardController.getSummary);

export { dashboardRouter };
