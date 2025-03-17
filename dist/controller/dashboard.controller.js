"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const services_1 = require("../services");
exports.dashboardController = {
    getSummary: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const summary = await services_1.dashboardService.getDashboardSummary({
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
