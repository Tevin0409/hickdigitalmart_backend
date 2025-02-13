"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const middleware_1 = require("../../middleware");
const userValidator_1 = require("../../validators/userValidator");
const userAdminRouter = express_1.default.Router();
exports.userAdminRouter = userAdminRouter;
userAdminRouter.post("/create-user", (0, middleware_1.validate)(userValidator_1.createUserSchema), middleware_1.authAdminMiddleware, controller_1.userController.createUser);
userAdminRouter.post("/login", controller_1.userController.login);
userAdminRouter.put("/update-user/:id", (0, middleware_1.validate)(userValidator_1.updateUserAdminSchema), middleware_1.authAdminMiddleware, controller_1.userController.updateUser);
userAdminRouter.get("/get-all-users", middleware_1.authAdminMiddleware, controller_1.userController.getAllUsers);
userAdminRouter.get("/get-user/:id", middleware_1.authAdminMiddleware, controller_1.userController.getUserById);
userAdminRouter.get("/get-user-by-email/:email", middleware_1.authAdminMiddleware, controller_1.userController.getUserByEmail);
userAdminRouter.post("/manage-permissions/:userId", middleware_1.authAdminMiddleware, controller_1.userController.managePermissions);
