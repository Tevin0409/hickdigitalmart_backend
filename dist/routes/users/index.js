"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("./user.route");
const product_route_1 = require("./product.route");
const usersRoute = express_1.default.Router();
usersRoute.use("/user/", user_route_1.userRouter);
usersRoute.use("/product/", product_route_1.userProductRouter);
exports.default = usersRoute;
