import express from "express";
import { productController } from "../../controller";
import { authMiddleware } from "../../middleware";

const userProductRouter = express.Router();

// Product Routes
userProductRouter.get("/", productController.getAllProducts);

// Category Routes
userProductRouter.get("/categories", authMiddleware, productController.getAllCategories);

// Cart Routes
userProductRouter.get("/cart", authMiddleware, productController.getCartItems);
userProductRouter.post("/cart/add", authMiddleware, productController.addToCart);
userProductRouter.patch("/cart/update/:cartId", authMiddleware, productController.updateCartItem);
userProductRouter.delete("/cart/remove/:cartId", authMiddleware, productController.removeFromCart);

// Wishlist Routes
userProductRouter.get("/wishlist", authMiddleware, productController.getWishlistItems);
userProductRouter.post("/wishlist/add", authMiddleware, productController.addToWishlist);
userProductRouter.delete("/wishlist/remove/:wishlistId", authMiddleware, productController.removeFromWishlist);


export { userProductRouter };
