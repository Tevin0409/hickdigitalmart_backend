import express from "express";
import { userController } from "../../controller";
import { authAdminMiddleware, validate } from "../../middleware";
import { createUserSchema } from "../../validators/userValidator";

const userAdminRouter = express.Router();

userAdminRouter.post("/create-user", validate(createUserSchema),authAdminMiddleware, userController.createUser);
userAdminRouter.post("/login", userController.login);
userAdminRouter.put(
  "/update-user/:id",
  authAdminMiddleware,
  userController.updateUser
);
userAdminRouter.get(
  "/get-all-users",
  authAdminMiddleware,
  userController.getAllUsers
);
userAdminRouter.get(
  "/get-user/:id",
  authAdminMiddleware,
  userController.getUserById
);
userAdminRouter.get(
  "/get-user-by-email/:email",
  authAdminMiddleware,
  userController.getUserByEmail
);
userAdminRouter.post(
  "/manage-permissions/:userId",
  authAdminMiddleware,
  userController.managePermissions
);

export { userAdminRouter };
