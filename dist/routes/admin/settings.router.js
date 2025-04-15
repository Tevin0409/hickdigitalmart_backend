"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingRouter = void 0;
// routes/settingRouter.ts
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../middleware");
const controller_1 = require("../../controller");
const settingRouter = express_1.default.Router();
exports.settingRouter = settingRouter;
settingRouter.post("/add-banner", middleware_1.authAdminMiddleware, controller_1.settingController.addBanner);
settingRouter.get("/banners", controller_1.settingController.getBanners);
settingRouter.get("/banner/:id", controller_1.settingController.getBanner);
settingRouter.put("/banner/:id", middleware_1.authAdminMiddleware, controller_1.settingController.updateBanner);
settingRouter.delete("/banner/:id", middleware_1.authAdminMiddleware, controller_1.settingController.deleteBanner);
