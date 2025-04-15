// routes/settingRouter.ts
import express from "express";
import { authAdminMiddleware } from "../../middleware";
import { settingController } from "../../controller";

const settingRouter = express.Router();

settingRouter.post("/add-banner", authAdminMiddleware, settingController.addBanner);
settingRouter.get("/banners", settingController.getBanners);
settingRouter.get("/banner/:id", settingController.getBanner);
settingRouter.put("/banner/:id", authAdminMiddleware, settingController.updateBanner);
settingRouter.delete("/banner/:id", authAdminMiddleware, settingController.deleteBanner);

export { settingRouter };
