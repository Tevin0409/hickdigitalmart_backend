import express from "express";
import { userRouter } from "./user.route";
import { roleRouter } from "./admin/role.router";
import { permissionRouter } from "./admin/permission.router";
import { productRouter } from "./admin/product.route";

const router = express.Router();
router.use("/user/", userRouter);
router.use("/role/", roleRouter);
router.use("/permission", permissionRouter);
router.use("/product", productRouter);

export default router;
