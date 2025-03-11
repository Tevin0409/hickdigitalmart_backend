import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";

export const dashboardController = {
  getSummary: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const summary = await dashboardService.getDashboardSummary({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      res.json(summary);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
