import express from "express";

import { userController } from "../controller";

const userRouter = express.Router();

userRouter.post("/create-user", userController.createUser);

userRouter.post("/login", userController.login);

export { userRouter };
