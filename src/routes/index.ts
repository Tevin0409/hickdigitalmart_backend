import express from "express";
import { userRouter } from "./user.route";
import { roleRouter } from "./admin/role.router";
import { permissionRouter } from "./admin/permission.router";

const router = express.Router();
router.use("/auth/", userRouter);
router.use("/role/", roleRouter);
router.use("/permission", permissionRouter);

export default router;
