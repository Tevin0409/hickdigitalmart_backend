import express from "express";
import { userController } from "../controller";

const authRouter = express.Router();

authRouter.post("/create-user", userController.createUser);
authRouter.post("/login", userController.login);
authRouter.post("/refresh", userController.refresh);
authRouter.post("/verify", userController.verify);

export { authRouter };
