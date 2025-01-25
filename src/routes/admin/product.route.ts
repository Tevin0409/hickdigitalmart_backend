import express from "express";
import { productController } from "../../controller";
import { authMiddleware } from "../../middleware";

const productRouter = express.Router();

// Product Routes
productRouter.get("/", productController.getAllProducts);
productRouter.post("/create", authMiddleware, productController.createProduct);
productRouter.patch("/update/:id", authMiddleware, productController.updateProduct);
productRouter.delete("/delete/:id", authMiddleware, productController.deleteProduct);
productRouter.get("/by-id/:id", authMiddleware, productController.getProduct);

// Category Routes
productRouter.get("/categories", authMiddleware, productController.getAllCategories);
productRouter.post("/categories/create", authMiddleware, productController.createCategory);
productRouter.patch("/categories/update/:id", authMiddleware, productController.updateCategory);
productRouter.delete("/categories/delete/:id", authMiddleware, productController.deleteCategory);

// Subcategory Routes
productRouter.get("/subcategories", authMiddleware, productController.getAllSubCategories);
productRouter.post("/subcategories/create", authMiddleware, productController.createSubCategory);
productRouter.patch("/subcategories/update/:id", authMiddleware, productController.updateSubCategory);
productRouter.delete("/subcategories/delete/:id", authMiddleware, productController.deleteSubCategory);

//inventory
productRouter.post("/add-stock",authMiddleware, productController.addStockToProduct);
productRouter.patch("/update-stock",authMiddleware, productController.updateStock);
productRouter.get("/check-stock/:productModelId",authMiddleware, productController.checkStock);

//upload images
productRouter.post('/upload',authMiddleware,productController.uploadFile)
productRouter.post('/add-images',authMiddleware,productController.addProductImages)
productRouter.post('/set-primary-image',authMiddleware,productController.setPrimaryImage)
productRouter.delete('/remove-image/:imageId',authMiddleware,productController.removeImage)


export { productRouter };
