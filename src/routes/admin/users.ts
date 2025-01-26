import express from "express";
import { userController } from "../../controller";
import { authMiddleware } from "../../middleware";

const userAdminRouter = express.Router();

userAdminRouter.post("/create-user", authMiddleware, userController.createUser);
userAdminRouter.post("/login", userController.login);
userAdminRouter.put(
  "/update-user/:id",
  authMiddleware,
  userController.updateUser
);
userAdminRouter.get(
  "/get-all-users",
  authMiddleware,
  userController.getAllUsers
);
userAdminRouter.get(
  "/get-user/:id",
  authMiddleware,
  userController.getUserById
);
userAdminRouter.get(
  "/get-user-by-email/:email",
  authMiddleware,
  userController.getUserByEmail
);

export { userAdminRouter };
