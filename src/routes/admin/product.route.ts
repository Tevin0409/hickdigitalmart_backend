import express from "express";
import { productController } from "../../controller";
import { authAdminMiddleware, validate } from "../../middleware";
import { productSchema } from "../../validators/productValidator";

const productRouter = express.Router();

// Product Routes
productRouter.get("/", authAdminMiddleware,productController.getAllProducts);
productRouter.post("/create",validate(productSchema), authAdminMiddleware, productController.createProduct);
productRouter.patch("/update/:id", authAdminMiddleware, productController.updateProduct);
productRouter.delete("/delete/:id", authAdminMiddleware, productController.deleteProduct);
productRouter.get("/by-id/:id", authAdminMiddleware, productController.getProduct);
productRouter.get("/model/by-id/:id",authAdminMiddleware, productController.getProductModel);
productRouter.patch("/product-models/:modelId",authAdminMiddleware, productController.updateProductModdel);
productRouter.patch("/publish-product/:modelId",authAdminMiddleware, productController.moveProductToLive);
productRouter.patch("/update-feature-list/:modelId",authAdminMiddleware, productController.updateFeatureList);

// Category Routes
productRouter.get("/categories", authAdminMiddleware, productController.getAllCategories);
productRouter.post("/categories/create", authAdminMiddleware, productController.createCategory);
productRouter.patch("/categories/update/:id", authAdminMiddleware, productController.updateCategory);
productRouter.delete("/categories/delete/:id", authAdminMiddleware, productController.deleteCategory);

// Subcategory Routes
productRouter.get("/subcategories", authAdminMiddleware, productController.getAllSubCategories);
productRouter.post("/subcategories/create", authAdminMiddleware, productController.createSubCategory);
productRouter.patch("/subcategories/update/:id", authAdminMiddleware, productController.updateSubCategory);
productRouter.delete("/subcategories/delete/:id", authAdminMiddleware, productController.deleteSubCategory);

//inventory
productRouter.post("/add-stock",authAdminMiddleware, productController.addStockToProduct);
productRouter.patch("/update-stock",authAdminMiddleware, productController.updateStock);
productRouter.get("/check-stock/:productModelId",authAdminMiddleware, productController.checkStock);

//upload images
productRouter.post('/upload',authAdminMiddleware,productController.uploadFile)
productRouter.post('/add-images',authAdminMiddleware,productController.addProductImages)
productRouter.post('/set-primary-image',authAdminMiddleware,productController.setPrimaryImage)
productRouter.delete('/remove-image/:imageId',authAdminMiddleware,productController.removeImage)

//bulk upload 

productRouter.post('/upload-xslx',authAdminMiddleware,productController.uploadBulkProducts)

//orders
productRouter.get("/orders",authAdminMiddleware, productController.getAllOrders);

//Reviews
productRouter.get("/reviews",authAdminMiddleware, productController.getAllReviews);
productRouter.get("/reviews/:productModelId",authAdminMiddleware, productController.getReviews);
productRouter.post("/respond-review/:reviewId",authAdminMiddleware, productController.resondTOReview);

//Price
productRouter.get("/price-percentages",authAdminMiddleware, productController.getPricePercentages);
productRouter.post("/create-price-percentages",authAdminMiddleware, productController.createPricePercentage);
productRouter.patch("/update-price-percentages/:percentagePriceId",authAdminMiddleware, productController.updatePercentagePrice);

productRouter.post("/schedule-price-change",authAdminMiddleware, productController.schedulePriceChange);
productRouter.patch("/update-schedule-price-change/:pricePercentageId",authAdminMiddleware, productController.updateScheduledPriceChange);
productRouter.get('/get-scheduled-price-changes',authAdminMiddleware, productController.getScheduledPriceChange);

//Quotation
productRouter.get("/quotation", authAdminMiddleware, productController.getAllQuotations);



export { productRouter };
