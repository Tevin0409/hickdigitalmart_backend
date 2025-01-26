import express from "express";
import { userController } from "../controller";
import { createUserSchema } from "../validators/userValidator";
import { validate } from "../middleware";

const authRouter = express.Router();

authRouter.post("/create-user",validate(createUserSchema), userController.createUser);
authRouter.post("/login", userController.login);
authRouter.post("/refresh", userController.refresh);
authRouter.post("/verify", userController.verify);

export { authRouter };
