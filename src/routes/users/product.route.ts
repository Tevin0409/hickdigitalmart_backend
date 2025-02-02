import express from "express";
import { productController } from "../../controller"; 
import { authMiddleware, validate } from "../../middleware";
import { addCartSchema, addWhishlisttSchema, checkoutSchema, updateCartSchema } from "../../validators/productValidator";

const userProductRouter = express.Router();

// Product Routes
userProductRouter.get("/", productController.getAllProducts);
userProductRouter.get("/product-models", productController.getAllProductsModels);
userProductRouter.get("/by-id/:id", productController.getProduct);
userProductRouter.get("/model/by-id/:id", productController.getProductModel);

// Category Routes
userProductRouter.get("/categories", productController.getAllCategories);

// Cart Routes
userProductRouter.get("/cart", authMiddleware, productController.getCartItems);
userProductRouter.post("/cart/add",validate(addCartSchema), authMiddleware, productController.addToCart);
userProductRouter.patch("/cart/update/:cartId",validate(updateCartSchema), authMiddleware, productController.updateCartItem);
userProductRouter.delete("/cart/remove/:cartId", authMiddleware, productController.removeFromCart);

// Wishlist Routes
userProductRouter.get("/wishlist", authMiddleware, productController.getWishlistItems);
userProductRouter.post("/wishlist/add", validate(addWhishlisttSchema),authMiddleware, productController.addToWishlist);
userProductRouter.delete("/wishlist/remove/:wishlistId", authMiddleware, productController.removeFromWishlist);

// Order Routes
userProductRouter.post("/orders", authMiddleware, productController.createOrder);
userProductRouter.get("/orders", authMiddleware, productController.getOrders); 
userProductRouter.get("/orders/:orderId", authMiddleware, productController.getOrder);
userProductRouter.delete("/orders/:orderId", authMiddleware, productController.deleteOrder); 

//checkout 
userProductRouter.post("/checkout", validate(checkoutSchema), authMiddleware, productController.checkout);


export { userProductRouter };
