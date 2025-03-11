"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controller_1 = require("../../controller");
const dashboardRouter = express_1.default.Router();
exports.dashboardRouter = dashboardRouter;
dashboardRouter.get("/", middleware_1.authAdminMiddleware, controller_1.dashboardController.getSummary);
