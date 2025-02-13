"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../../controller");
const middleware_1 = require("../../middleware");
const productValidator_1 = require("../../validators/productValidator");
const productRouter = express_1.default.Router();
exports.productRouter = productRouter;
// Product Routes
productRouter.get("/", middleware_1.authAdminMiddleware, controller_1.productController.getAllProducts);
productRouter.post("/create", (0, middleware_1.validate)(productValidator_1.productSchema), middleware_1.authAdminMiddleware, controller_1.productController.createProduct);
productRouter.patch("/update/:id", middleware_1.authAdminMiddleware, controller_1.productController.updateProduct);
productRouter.delete("/delete/:id", middleware_1.authAdminMiddleware, controller_1.productController.deleteProduct);
productRouter.get("/by-id/:id", middleware_1.authAdminMiddleware, controller_1.productController.getProduct);
productRouter.get("/model/by-id/:id", controller_1.productController.getProductModel);
// Category Routes
productRouter.get("/categories", middleware_1.authAdminMiddleware, controller_1.productController.getAllCategories);
productRouter.post("/categories/create", middleware_1.authAdminMiddleware, controller_1.productController.createCategory);
productRouter.patch("/categories/update/:id", middleware_1.authAdminMiddleware, controller_1.productController.updateCategory);
productRouter.delete("/categories/delete/:id", middleware_1.authAdminMiddleware, controller_1.productController.deleteCategory);
// Subcategory Routes
productRouter.get("/subcategories", middleware_1.authAdminMiddleware, controller_1.productController.getAllSubCategories);
productRouter.post("/subcategories/create", middleware_1.authAdminMiddleware, controller_1.productController.createSubCategory);
productRouter.patch("/subcategories/update/:id", middleware_1.authAdminMiddleware, controller_1.productController.updateSubCategory);
productRouter.delete("/subcategories/delete/:id", middleware_1.authAdminMiddleware, controller_1.productController.deleteSubCategory);
//inventory
productRouter.post("/add-stock", middleware_1.authAdminMiddleware, controller_1.productController.addStockToProduct);
productRouter.patch("/update-stock", middleware_1.authAdminMiddleware, controller_1.productController.updateStock);
productRouter.get("/check-stock/:productModelId", middleware_1.authAdminMiddleware, controller_1.productController.checkStock);
//upload images
productRouter.post('/upload', middleware_1.authAdminMiddleware, controller_1.productController.uploadFile);
productRouter.post('/add-images', middleware_1.authAdminMiddleware, controller_1.productController.addProductImages);
productRouter.post('/set-primary-image', middleware_1.authAdminMiddleware, controller_1.productController.setPrimaryImage);
productRouter.delete('/remove-image/:imageId', middleware_1.authAdminMiddleware, controller_1.productController.removeImage);
//bulk upload 
productRouter.post('/upload-xslx', middleware_1.authAdminMiddleware, controller_1.productController.uploadBulkProducts);
