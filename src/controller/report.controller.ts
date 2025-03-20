import express from "express";
import { reportService } from "../services";
import { IUserRequest } from "../middleware";

export const reportController = {
  getUserRegistrations: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.userRegistrations(startDate as string, endDate as string);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getVerifiedUsers: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const report = await reportService.verifiedUsers();
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getSalesSummary: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.salesSummary(startDate as string, endDate as string);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getOrderStatus: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const report = await reportService.orderStatus();
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getTopProducts: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.topProducts(startDate as string, endDate as string);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getCartAbandonment: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const report = await reportService.cartAbandonment();
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getLowStock: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
        const qty =req.query.quantity || 10 
      const report = await reportService.lowStock(+qty);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getTransactionSuccessRate: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const report = await reportService.transactionSuccessRate();
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getCustomerOrders: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const { userId } = req.params;
      const report = await reportService.customerOrders(userId);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getWishlistTrends: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const report = await reportService.wishlistTrends();
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },

  getTechnicianRegistrations: async (req: IUserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const report = await reportService.technicianRegistrations(startDate as string, endDate as string);
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },
};
