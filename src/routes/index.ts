import express from "express";
import adminRouter from "./admin";
import { authRouter } from "./auth.route";
import usersRoute from "./users";
import { productController } from "../controller";

const router = express.Router();
router.use("/admin/", adminRouter);
router.use("/auth/", authRouter);
router.use("/", usersRoute);
router.use("/callback", productController.callbackURl);

export default router;
