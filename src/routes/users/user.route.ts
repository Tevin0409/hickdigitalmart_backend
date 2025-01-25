import express from "express";
import { userController ,roleController} from "../../controller";

const userRouter = express.Router();

userRouter.post("/create-user", userController.createUser);
userRouter.post("/login", userController.login);
userRouter.put("/update-user/:id", userController.updateUser);
userRouter.get("/get-all-users", userController.getAllUsers);
userRouter.get("/get-user/:id", userController.getUserById);
userRouter.get("/get-user-by-email/:email", userController.getUserByEmail);
userRouter.get("/roles", roleController.getAllRoles);

export { userRouter };