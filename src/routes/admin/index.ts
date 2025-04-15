import express from "express";
import { userAdminRouter } from "./users";
import { permissionRouter } from "./permission.router";
import { roleRouter } from "./role.router";
import { productRouter } from "./product.route";
import { dashboardRouter } from "./dashboard.router";
import { reportRouter } from "./report.router";
import { settingRouter } from "./settings.router";

const adminRouter = express.Router();
adminRouter.use("/user/", userAdminRouter);
adminRouter.use("/role/", roleRouter);
adminRouter.use("/permission", permissionRouter);
adminRouter.use("/product", productRouter);
adminRouter.use("/dashboard", dashboardRouter);
adminRouter.use("/report", reportRouter);
adminRouter.use("/settings", settingRouter);
export default adminRouter;
