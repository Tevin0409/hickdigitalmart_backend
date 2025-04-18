import express from "express";
import { productController } from "../../controller"; 
import { authMiddleware, validate } from "../../middleware";
import { addCartSchema, addWhishlisttSchema, checkoutSchema, createOrderSchema, QuotationSchema, updateCartSchema } from "../../validators/productValidator";

const userProductRouter = express.Router();

// Product Routes
userProductRouter.get("/", productController.getAllProducts);
userProductRouter.get("/product-models", productController.getAllProductsModels);
userProductRouter.get("/by-id/:id", productController.getProduct);
userProductRouter.get("/model/by-id/:id", productController.getProductModel);

//Features
userProductRouter.get("/features", productController.getAllFeatures);

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
userProductRouter.post("/orders",validate(createOrderSchema), authMiddleware, productController.createOrder);
userProductRouter.post("/orders/anonymous",validate(createOrderSchema), productController.createAnonymousOrders);
userProductRouter.get("/orders", authMiddleware, productController.getOrders); 
userProductRouter.get("/orders/:orderId", authMiddleware, productController.getOrder);
userProductRouter.delete("/orders/:orderId", authMiddleware, productController.deleteOrder);
userProductRouter.post("/order/by-email", productController.getOrderByEmail);

//checkout 
userProductRouter.post("/checkout", validate(checkoutSchema), productController.checkout);

//Review
userProductRouter.post("/add-review", authMiddleware, productController.addReview);
userProductRouter.get("/reviews/:productModelId", productController.getReviews);

//Quaotation
userProductRouter.post("/quotation",validate(QuotationSchema), authMiddleware, productController.createQuotation);
userProductRouter.get("/quotation", authMiddleware, productController.getUserQuotations);


export { userProductRouter };
