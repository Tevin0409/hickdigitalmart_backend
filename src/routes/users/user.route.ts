import express from "express";
import { userController ,roleController} from "../../controller";
import { createUserSchema } from "../../validators/userValidator";
import { authMiddleware, validate } from "../../middleware";

const userRouter = express.Router();

userRouter.post("/create-user",validate(createUserSchema), userController.createUser);
userRouter.post("/login", userController.login);
userRouter.put("/update-user/:id",authMiddleware, userController.updateUser);
userRouter.get("/get-user/",authMiddleware, userController.getUser);
userRouter.get("/get-user-by-email/:email",authMiddleware, userController.getUserByEmail);
userRouter.get("/roles", roleController.getUserRoles);

export { userRouter };