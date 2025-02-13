"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const permission_router_1 = require("./permission.router");
const role_router_1 = require("./role.router");
const product_route_1 = require("./product.route");
const adminRouter = express_1.default.Router();
adminRouter.use("/user/", users_1.userAdminRouter);
adminRouter.use("/role/", role_router_1.roleRouter);
adminRouter.use("/permission", permission_router_1.permissionRouter);
adminRouter.use("/product", product_route_1.productRouter);
exports.default = adminRouter;
