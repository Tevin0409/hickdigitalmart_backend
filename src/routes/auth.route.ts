import express from "express";
import { userController } from "../controller";
import {
  changePasswordSchema,
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/userValidator";
import { authMiddleware, validate } from "../middleware";

const authRouter = express.Router();

authRouter.post(
  "/create-user",
  validate(createUserSchema),
  userController.createUser
);
authRouter.post("/login", userController.login);
authRouter.post("/admin/login", userController.loginAdmin)
authRouter.post("/refresh", userController.refresh);
authRouter.post("/verify", userController.verify);
authRouter.post(
  "/change-password",
  validate(changePasswordSchema),
  authMiddleware,
  userController.ChangePassword
);
authRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  userController.forgotPassword
);
authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  userController.resetPassword
);
authRouter.post("/logout", userController.logout);

export { authRouter };
