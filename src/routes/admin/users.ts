import express from "express";
import { userController } from "../../controller";

const userAdminRouter = express.Router();

userAdminRouter.post("/create-user", userController.createUser);
userAdminRouter.post("/login", userController.login);
userAdminRouter.put("/update-user/:id", userController.updateUser);
userAdminRouter.get("/get-all-users", userController.getAllUsers);
userAdminRouter.get("/get-user/:id", userController.getUserById);
userAdminRouter.get("/get-user-by-email/:email", userController.getUserByEmail);

export { userAdminRouter };