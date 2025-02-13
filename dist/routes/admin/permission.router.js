"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const middleware_1 = require("../../middleware");
const permissionRouter = express_1.default.Router();
exports.permissionRouter = permissionRouter;
permissionRouter.get("/", middleware_1.authAdminMiddleware, controller_1.permissionController.getAllpermissions);
permissionRouter.post("/create-permission", middleware_1.authAdminMiddleware, controller_1.permissionController.createpermission);
permissionRouter.patch("/update/:id", middleware_1.authAdminMiddleware, controller_1.permissionController.updatepermission);
permissionRouter.delete("/delete/:id", middleware_1.authAdminMiddleware, controller_1.permissionController.deletepermission);
