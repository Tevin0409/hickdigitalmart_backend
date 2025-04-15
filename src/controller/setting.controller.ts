// controller/settingController.ts
import { Request, Response } from "express";
import { settingsService } from "../services";

export const settingController = {
  addBanner: async (req: Request, res: Response) => {
    try {
      const banner = await settingsService.addBanner(req.body);
      res.status(201).json(banner);
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getBanners: async (_req: Request, res: Response) => {
    try {
      const banners = await settingsService.getAllBanners();
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getBanner: async (req: Request, res: Response) => {
    try {
      const banner = await settingsService.getBannerById(req.params.id);
      if (!banner) {
        res.status(404).json({ message: "Banner not found" });
        return;
      }
      res.json(banner);
    } catch (error) {
      console.error("Error fetching banner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateBanner: async (req: Request, res: Response) => {
    try {
      const updated = await settingsService.updateBanner(
        req.params.id,
        req.body
      );
      res.json(updated);
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteBanner: async (req: Request, res: Response) => {
    try {
      await settingsService.deleteBanner(req.params.id);
      res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      console.error("Error deleting banner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
