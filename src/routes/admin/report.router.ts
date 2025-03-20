import express from "express";
import { reportController } from "../../controller";
import { authAdminMiddleware } from "../../middleware";

const reportRouter = express.Router();

reportRouter.get("/user-registrations", authAdminMiddleware, reportController.getUserRegistrations);
reportRouter.get("/verified-users", authAdminMiddleware, reportController.getVerifiedUsers);
reportRouter.get("/sales-summary", authAdminMiddleware, reportController.getSalesSummary);
reportRouter.get("/order-status", authAdminMiddleware, reportController.getOrderStatus);
reportRouter.get("/top-products", authAdminMiddleware, reportController.getTopProducts);
reportRouter.get("/cart-abandonment", authAdminMiddleware, reportController.getCartAbandonment);
reportRouter.get("/low-stock", authAdminMiddleware, reportController.getLowStock);
reportRouter.get("/transaction-success", authAdminMiddleware, reportController.getTransactionSuccessRate);
reportRouter.get("/customer-orders/:userId", authAdminMiddleware, reportController.getCustomerOrders);
reportRouter.get("/wishlist-trends", authAdminMiddleware, reportController.getWishlistTrends);
reportRouter.get("/technician-registrations", authAdminMiddleware, reportController.getTechnicianRegistrations);

export { reportRouter };
