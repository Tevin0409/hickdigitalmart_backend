"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const userValidator_1 = require("../../validators/userValidator");
const middleware_1 = require("../../middleware");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post("/create-user", (0, middleware_1.validate)(userValidator_1.createUserSchema), controller_1.userController.createUser);
userRouter.post("/login", controller_1.userController.login);
userRouter.put("/update-user/:id", middleware_1.authMiddleware, (0, middleware_1.validate)(userValidator_1.updateUserSchema), controller_1.userController.updateUser);
userRouter.get("/get-user/", middleware_1.authMiddleware, controller_1.userController.getUser);
userRouter.get("/get-user-by-email/:email", middleware_1.authMiddleware, controller_1.userController.getUserByEmail);
userRouter.get("/roles", controller_1.roleController.getUserRoles);
userRouter.post("/technician-questionnaire", (0, middleware_1.validate)(userValidator_1.technicianQuestionnaireSchema), controller_1.userController.addTechnicianQuestionnaire);
