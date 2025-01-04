import express from "express";
import adminRouter from "./admin";
import { authRouter } from "./auth.route";
import usersRoute from "./users";

const router = express.Router();
router.use("/admin/", adminRouter);
router.use("/auth/", authRouter);
router.use("/", usersRoute);

export default router;
