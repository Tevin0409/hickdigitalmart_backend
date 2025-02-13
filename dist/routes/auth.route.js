"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const userValidator_1 = require("../validators/userValidator");
const middleware_1 = require("../middleware");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.post("/create-user", (0, middleware_1.validate)(userValidator_1.createUserSchema), controller_1.userController.createUser);
authRouter.post("/login", controller_1.userController.login);
authRouter.post("/refresh", controller_1.userController.refresh);
authRouter.post("/verify", controller_1.userController.verify);
authRouter.post("/change-password", (0, middleware_1.validate)(userValidator_1.changePasswordSchema), middleware_1.authMiddleware, controller_1.userController.ChangePassword);
authRouter.post("/forgot-password", (0, middleware_1.validate)(userValidator_1.forgotPasswordSchema), controller_1.userController.forgotPassword);
authRouter.post("/reset-password", (0, middleware_1.validate)(userValidator_1.resetPasswordSchema), controller_1.userController.resetPassword);
