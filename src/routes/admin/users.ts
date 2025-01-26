import express from "express";
import { userController } from "../../controller";
import { authMiddleware, validate } from "../../middleware";
import { createUserSchema } from "../../validators/userValidator";

const userAdminRouter = express.Router();

userAdminRouter.post("/create-user", validate(createUserSchema),authMiddleware, userController.createUser);
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
