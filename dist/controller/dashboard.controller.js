"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
exports.dashboardController = {
    getSummary: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const summary = await dashboard_service_1.default.getDashboardSummary({
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
            });
            res.json(summary);
        }
        catch (error) {
            console.error("Error fetching dashboard summary:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
};
