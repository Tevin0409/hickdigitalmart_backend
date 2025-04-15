"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingController = void 0;
const services_1 = require("../services");
exports.settingController = {
    addBanner: async (req, res) => {
        try {
            const banner = await services_1.settingsService.addBanner(req.body);
            res.status(201).json(banner);
        }
        catch (error) {
            console.error("Error creating banner:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    getBanners: async (_req, res) => {
        try {
            const banners = await services_1.settingsService.getAllBanners();
            res.json(banners);
        }
        catch (error) {
            console.error("Error fetching banners:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    getBanner: async (req, res) => {
        try {
            const banner = await services_1.settingsService.getBannerById(req.params.id);
            if (!banner) {
                res.status(404).json({ message: "Banner not found" });
                return;
            }
            res.json(banner);
        }
        catch (error) {
            console.error("Error fetching banner:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    updateBanner: async (req, res) => {
        try {
            const updated = await services_1.settingsService.updateBanner(req.params.id, req.body);
            res.json(updated);
        }
        catch (error) {
            console.error("Error updating banner:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    deleteBanner: async (req, res) => {
        try {
            await services_1.settingsService.deleteBanner(req.params.id);
            res.json({ message: "Banner deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting banner:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
};
