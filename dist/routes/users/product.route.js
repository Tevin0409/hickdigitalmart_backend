"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProductRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const middleware_1 = require("../../middleware");
const productValidator_1 = require("../../validators/productValidator");
const userProductRouter = express_1.default.Router();
exports.userProductRouter = userProductRouter;
// Product Routes
userProductRouter.get("/", controller_1.productController.getAllProducts);
userProductRouter.get("/product-models", controller_1.productController.getAllProductsModels);
userProductRouter.get("/by-id/:id", controller_1.productController.getProduct);
userProductRouter.get("/model/by-id/:id", controller_1.productController.getProductModel);
//Features
userProductRouter.get("/features", controller_1.productController.getAllFeatures);
// Category Routes
userProductRouter.get("/categories", controller_1.productController.getAllCategories);
// Cart Routes
userProductRouter.get("/cart", middleware_1.authMiddleware, controller_1.productController.getCartItems);
userProductRouter.post("/cart/add", (0, middleware_1.validate)(productValidator_1.addCartSchema), middleware_1.authMiddleware, controller_1.productController.addToCart);
userProductRouter.patch("/cart/update/:cartId", (0, middleware_1.validate)(productValidator_1.updateCartSchema), middleware_1.authMiddleware, controller_1.productController.updateCartItem);
userProductRouter.delete("/cart/remove/:cartId", middleware_1.authMiddleware, controller_1.productController.removeFromCart);
// Wishlist Routes
userProductRouter.get("/wishlist", middleware_1.authMiddleware, controller_1.productController.getWishlistItems);
userProductRouter.post("/wishlist/add", (0, middleware_1.validate)(productValidator_1.addWhishlisttSchema), middleware_1.authMiddleware, controller_1.productController.addToWishlist);
userProductRouter.delete("/wishlist/remove/:wishlistId", middleware_1.authMiddleware, controller_1.productController.removeFromWishlist);
// Order Routes
userProductRouter.post("/orders", (0, middleware_1.validate)(productValidator_1.createOrderSchema), middleware_1.authMiddleware, controller_1.productController.createOrder);
userProductRouter.get("/orders", middleware_1.authMiddleware, controller_1.productController.getOrders);
userProductRouter.get("/orders/:orderId", middleware_1.authMiddleware, controller_1.productController.getOrder);
userProductRouter.delete("/orders/:orderId", middleware_1.authMiddleware, controller_1.productController.deleteOrder);
//checkout 
userProductRouter.post("/checkout", (0, middleware_1.validate)(productValidator_1.checkoutSchema), middleware_1.authMiddleware, controller_1.productController.checkout);
