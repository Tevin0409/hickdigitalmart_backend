import express from "express";
import { productController } from "../../controller"; 
import { authMiddleware } from "../../middleware";

const userProductRouter = express.Router();

// Product Routes
userProductRouter.get("/", productController.getAllProducts);
userProductRouter.get("/by-id/:id", productController.getProduct);

// Category Routes
userProductRouter.get("/categories", productController.getAllCategories);

// Cart Routes
userProductRouter.get("/cart", authMiddleware, productController.getCartItems);
userProductRouter.post("/cart/add", authMiddleware, productController.addToCart);
userProductRouter.patch("/cart/update/:cartId", authMiddleware, productController.updateCartItem);
userProductRouter.delete("/cart/remove/:cartId", authMiddleware, productController.removeFromCart);

// Wishlist Routes
userProductRouter.get("/wishlist", authMiddleware, productController.getWishlistItems);
userProductRouter.post("/wishlist/add", authMiddleware, productController.addToWishlist);
userProductRouter.delete("/wishlist/remove/:wishlistId", authMiddleware, productController.removeFromWishlist);

// Order Routes
userProductRouter.post("/orders", authMiddleware, productController.createOrder);
userProductRouter.get("/orders", authMiddleware, productController.getOrders); 
userProductRouter.get("/orders/:orderId", authMiddleware, productController.getOrder);
userProductRouter.delete("/orders/:orderId", authMiddleware, productController.deleteOrder); 

export { userProductRouter };
