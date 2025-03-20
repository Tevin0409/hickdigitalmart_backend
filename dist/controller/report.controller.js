"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const services_1 = require("../services");
exports.reportController = {
    getUserRegistrations: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const report = await services_1.reportService.userRegistrations(startDate, endDate);
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getVerifiedUsers: async (req, res, next) => {
        try {
            const report = await services_1.reportService.verifiedUsers();
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getSalesSummary: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const report = await services_1.reportService.salesSummary(startDate, endDate);
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getOrderStatus: async (req, res, next) => {
        try {
            const report = await services_1.reportService.orderStatus();
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getTopProducts: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const report = await services_1.reportService.topProducts(startDate, endDate);
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getCartAbandonment: async (req, res, next) => {
        try {
            const report = await services_1.reportService.cartAbandonment();
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getLowStock: async (req, res, next) => {
        try {
            const qty = req.query.quantity || 10;
            const report = await services_1.reportService.lowStock(+qty);
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getTransactionSuccessRate: async (req, res, next) => {
        try {
            const report = await services_1.reportService.transactionSuccessRate();
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getCustomerOrders: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const report = await services_1.reportService.customerOrders(userId);
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getWishlistTrends: async (req, res, next) => {
        try {
            const report = await services_1.reportService.wishlistTrends();
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
    getTechnicianRegistrations: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const report = await services_1.reportService.technicianRegistrations(startDate, endDate);
            res.status(200).json(report);
        }
        catch (error) {
            next(error);
        }
    },
};
