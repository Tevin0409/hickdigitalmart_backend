"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = __importDefault(require("./admin"));
const auth_route_1 = require("./auth.route");
const users_1 = __importDefault(require("./users"));
const controller_1 = require("../controller");
const router = express_1.default.Router();
router.use("/admin/", admin_1.default);
router.use("/auth/", auth_route_1.authRouter);
router.use("/", users_1.default);
router.use("/callback", controller_1.productController.callbackURl);
exports.default = router;
