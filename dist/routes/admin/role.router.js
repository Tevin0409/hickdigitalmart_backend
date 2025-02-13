"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const middleware_1 = require("../../middleware");
const userValidator_1 = require("../../validators/userValidator");
const roleRouter = express_1.default.Router();
exports.roleRouter = roleRouter;
roleRouter.get("/", controller_1.roleController.getAllRoles);
roleRouter.post("/create-role", middleware_1.authAdminMiddleware, (0, middleware_1.validate)(userValidator_1.createRoleSchema), controller_1.roleController.createrole);
roleRouter.patch("/update/:id", middleware_1.authAdminMiddleware, controller_1.roleController.updateRole);
roleRouter.delete("/delete/:id", middleware_1.authAdminMiddleware, controller_1.roleController.deleteRole);
