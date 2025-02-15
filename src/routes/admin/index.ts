import express from "express";
import { userAdminRouter } from "./users";
import { permissionRouter } from "./permission.router";
import { roleRouter } from "./role.router";
import { productRouter } from "./product.route";

const adminRouter = express.Router();
adminRouter.use("/user/", userAdminRouter);
adminRouter.use("/role/", roleRouter);
adminRouter.use("/permission", permissionRouter);
adminRouter.use("/product", productRouter);

export default adminRouter;
