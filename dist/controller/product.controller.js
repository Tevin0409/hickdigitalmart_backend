"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const services_1 = require("../services");
const xlsx_1 = __importDefault(require("xlsx"));
const stk_Service_1 = require("../services/mpesa/stk.Service");
exports.productController = {
    // Product Handlers
    getAllProducts: async (req, res, next) => {
        try {
            const { searchTerm, categoryIds, subCategoryIds, featureIds, minPrice, maxPrice, page, limit, } = req.query;
            const products = await services_1.productService.getAllProducts(searchTerm, categoryIds
                ? (Array.isArray(categoryIds)
                    ? categoryIds
                    : [categoryIds])
                : undefined, subCategoryIds
                ? (Array.isArray(subCategoryIds)
                    ? subCategoryIds
                    : [subCategoryIds])
                : undefined, featureIds
                ? (Array.isArray(featureIds)
                    ? featureIds
                    : [featureIds])
                : undefined, minPrice ? parseFloat(minPrice) : undefined, maxPrice ? parseFloat(maxPrice) : undefined, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
            res.status(200).json(products);
        }
        catch (error) {
            next(error);
        }
    },
    getAllProductsModels: async (req, res, next) => {
        try {
            const { searchTerm, categoryIds, subCategoryIds, featureIds, minPrice, maxPrice, page, limit, } = req.query;
            const roleId = req.user?.roleId;
            const products = await services_1.productService.getAllProductsModels(searchTerm, categoryIds
                ? (Array.isArray(categoryIds)
                    ? categoryIds
                    : [categoryIds])
                : undefined, subCategoryIds
                ? (Array.isArray(subCategoryIds)
                    ? subCategoryIds
                    : [subCategoryIds])
                : undefined, featureIds
                ? (Array.isArray(featureIds)
                    ? featureIds
                    : [featureIds])
                : undefined, minPrice ? parseFloat(minPrice) : undefined, maxPrice ? parseFloat(maxPrice) : undefined, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10, roleId);
            res.status(200).json(products);
        }
        catch (error) {
            next(error);
        }
    },
    createProduct: async (req, res, next) => {
        try {
            const { productData } = req.body;
            const product = await services_1.productService.createProduct(productData);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    getProduct: async (req, res, next) => {
        try {
            const product = await services_1.productService.getProductById(req.params.id);
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    getProductModel: async (req, res, next) => {
        try {
            const product = await services_1.productService.getProductModelById(req.params.id);
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    getAllFeatures: async (req, res, next) => {
        try {
            const { categoryId, productId, productModelId } = req.query;
            const product = await services_1.productService.getFeature(categoryId, productId, productModelId);
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const updatedProduct = await services_1.productService.updateProduct(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    },
    updateProductModdel: async (req, res, next) => {
        try {
            const updatedProduct = await services_1.productService.updateProductModel(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            await services_1.productService.deleteProduct(req.params.id);
            res.status(200).json({ message: "Product deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    // Category Handlers
    getAllCategories: async (req, res, next) => {
        try {
            const categories = await services_1.productService.getAllCategories();
            res.status(200).json(categories);
        }
        catch (error) {
            next(error);
        }
    },
    createCategory: async (req, res, next) => {
        try {
            const category = await services_1.productService.createCategory(req.body);
            res.status(201).json(category);
        }
        catch (error) {
            next(error);
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const updatedCategory = await services_1.productService.updateCategory(req.params.id, req.body);
            res.status(200).json(updatedCategory);
        }
        catch (error) {
            next(error);
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            await services_1.productService.deleteCategory(req.params.id);
            res.status(200).json({ message: "Category deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    // Subcategory Handlers
    getAllSubCategories: async (req, res, next) => {
        try {
            const subcategories = await services_1.productService.getAllSubCategories();
            res.status(200).json(subcategories);
        }
        catch (error) {
            next(error);
        }
    },
    createSubCategory: async (req, res, next) => {
        try {
            const subcategory = await services_1.productService.createSubCategory(req.body);
            res.status(201).json(subcategory);
        }
        catch (error) {
            next(error);
        }
    },
    updateSubCategory: async (req, res, next) => {
        try {
            const updatedSubCategory = await services_1.productService.updateSubCategory(req.params.id, req.body);
            res.status(200).json(updatedSubCategory);
        }
        catch (error) {
            next(error);
        }
    },
    deleteSubCategory: async (req, res, next) => {
        try {
            await services_1.productService.deleteSubCategory(req.params.id);
            res.status(200).json({ message: "Subcategory deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    addStockToProduct: async (req, res, next) => {
        try {
            const { productModelId, quantityToAdd } = req.body;
            // Add stock to the product
            const updatedInventory = await services_1.productService.addStockToProduct(productModelId, quantityToAdd);
            res.status(200).json(updatedInventory);
        }
        catch (error) {
            next(error);
        }
    },
    // Update stock for a product (e.g., after a sale)
    updateStock: async (req, res, next) => {
        try {
            const { productModelId, quantityToUpdate } = req.body;
            // Update stock for the product
            const updatedInventory = await services_1.productService.updateStock(productModelId, quantityToUpdate);
            res.status(200).json(updatedInventory);
        }
        catch (error) {
            next(error);
        }
    },
    // Check stock for a product
    checkStock: async (req, res, next) => {
        try {
            const { productModelId } = req.params;
            // Check stock of the product
            const currentStock = await services_1.productService.checkStock(productModelId);
            res.status(200).json({ currentStock });
        }
        catch (error) {
            next(error);
        }
    },
    getCartItems: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const cartItems = await services_1.productService.getCartItems(userId);
            res.status(200).json(cartItems);
        }
        catch (error) {
            next(error);
        }
    },
    addToCart: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { productModelId, quantity } = req.body;
            const cartItem = await services_1.productService.addToCart(userId, productModelId, quantity);
            res.status(201).json(cartItem);
        }
        catch (error) {
            next(error);
        }
    },
    updateCartItem: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const cartId = req.params.cartId;
            const { quantity, productModelId } = req.body;
            const updatedCartItem = await services_1.productService.updateCartItem(userId, productModelId, quantity);
            res.status(200).json(updatedCartItem);
        }
        catch (error) {
            next(error);
        }
    },
    removeFromCart: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const cartId = req.params.cartId;
            await services_1.productService.removeFromCart(userId, cartId);
            res.status(200).json({ message: "Item removed from cart successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    // Wishlist Handlers
    getWishlistItems: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const wishlistItems = await services_1.productService.getWishlistItems(userId);
            res.status(200).json(wishlistItems);
        }
        catch (error) {
            next(error);
        }
    },
    addToWishlist: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { productModelId } = req.body;
            const wishlistItem = await services_1.productService.addToWishlist(userId, productModelId);
            res.status(201).json(wishlistItem);
        }
        catch (error) {
            next(error);
        }
    },
    removeFromWishlist: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const wishlistId = req.params.wishlistId;
            await services_1.productService.removeFromWishlist(userId, wishlistId);
            res
                .status(200)
                .json({ message: "Item removed from wishlist successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    createOrder: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const { first_name, last_name, company_name, street_address, apartment, town, phone_number, email, products, isVat, } = req.body;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const orderData = {
                first_name,
                last_name,
                company_name,
                street_address,
                apartment,
                town,
                phone_number,
                email,
                products,
                isVat,
            };
            const order = await services_1.productService.createOrder(userId, orderData);
            res.status(201).json(order);
        }
        catch (error) {
            next(error);
        }
    },
    createAnonymousOrders: async (req, res, next) => {
        try {
            const user = await services_1.userService.getUserByEmail("anonymous@yopmail.com");
            const userId = user.id;
            const { first_name, last_name, company_name, street_address, apartment, town, phone_number, email, products, isVat, } = req.body;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const orderData = {
                first_name,
                last_name,
                company_name,
                street_address,
                apartment,
                town,
                phone_number,
                email,
                products,
                isVat,
            };
            const order = await services_1.productService.createOrder(userId, orderData);
            res.status(201).json(order);
        }
        catch (error) {
            next(error);
        }
    },
    // Update order status
    updateOrderStatus: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            const updatedOrder = await services_1.productService.updateOrderStatus(orderId, status);
            res.status(200).json(updatedOrder);
        }
        catch (error) {
            next(error);
        }
    },
    // Get orders (for a specific user or all orders)
    getOrders: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const orders = await services_1.productService.getOrders(userId);
            res.status(200).json(orders);
        }
        catch (error) {
            next(error);
        }
    },
    getAllOrders: async (req, res, next) => {
        try {
            // Extract query parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const searchTerm = req.query.searchTerm;
            const status = req.query.status;
            // Call productService with the extracted parameters
            const orders = await services_1.productService.getAllOrders(page, limit, searchTerm, status);
            res.status(200).json(orders);
        }
        catch (error) {
            next(error);
        }
    },
    // Cancel an order
    cancelOrder: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { restoreStock } = req.body;
            const cancelledOrder = await services_1.productService.cancelOrder(orderId, restoreStock);
            res.status(200).json(cancelledOrder);
        }
        catch (error) {
            next(error);
        }
    },
    // Get a single order by ID
    getOrder: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const order = await services_1.productService.getOrder(orderId);
            res.status(200).json(order);
        }
        catch (error) {
            next(error);
        }
    },
    getOrderByEmail: async (req, res, next) => {
        try {
            const { email } = req.body;
            const orders = await services_1.productService.getOrderByEmail(email);
            res.status(200).json(orders);
        }
        catch (error) {
            next(error);
        }
    },
    // Delete an order by ID
    deleteOrder: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const result = await services_1.productService.deleteOrder(orderId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    uploadFile: async (req, res, next) => {
        try {
            if (!req.files || !req.files.file) {
                throw new Error("No file uploaded");
            }
            const files = Array.isArray(req.files.file)
                ? req.files.file
                : [req.files.file];
            const results = await services_1.productService.uploadFile(files);
            res.status(200).json(results);
        }
        catch (error) {
            next(error);
        }
    },
    addProductImages: async (req, res, next) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new Error("No files uploaded");
            }
            // Convert `req.files` to correct type
            const filesData = req.files;
            // Ensure type safety for service
            const formattedFiles = {};
            for (const key of Object.keys(filesData)) {
                formattedFiles[key] = Array.isArray(filesData[key])
                    ? filesData[key]
                    : filesData[key];
            }
            const results = await services_1.productService.addProductImages(formattedFiles);
            res.status(200).json(results);
        }
        catch (error) {
            next(error);
        }
    },
    setPrimaryImage: async (req, res, next) => {
        try {
            const { imageId, productModelId } = req.body;
            const product = await services_1.productService.setPrimaryImage(imageId, productModelId);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    removeImage: async (req, res, next) => {
        try {
            const { imageId } = req.params;
            const product = await services_1.productService.removeImage(imageId);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    uploadBulkProducts: async (req, res, next) => {
        try {
            // Step 1: Check if a file is uploaded
            if (!req.files || !req.files.file) {
                throw new Error("No file uploaded");
            }
            // Handle both single file or array of files
            const file = Array.isArray(req.files.file)
                ? req.files.file[0]
                : req.files.file;
            // Step 2: Read the uploaded Excel file
            const workbook = xlsx_1.default.readFile(file.tempFilePath);
            const sheetName = workbook.SheetNames[0]; // Assume first sheet is the one we need
            const sheet = workbook.Sheets[sheetName];
            // Step 3: Extract headers and validate them
            const headers = xlsx_1.default.utils.sheet_to_json(sheet, {
                header: 1,
            })[0];
            console.log("Headers from file:", headers); // Log the headers to debug
            const expectedHeaders = [
                "PRODUCT",
                "CATEGORY",
                "SUBCATEGORY",
                "MODEL_NAME",
                "MODEL_DESCRIPTION",
                "MODEL_PRICE",
                "MODEL_FEATURES",
                "INVENTORY_QUANTITY",
            ];
            // Trim spaces from headers before comparison
            const trimmedHeaders = headers.map((header) => header.trim());
            const trimmedExpectedHeaders = expectedHeaders.map((header) => header.trim());
            // Validate headers
            const headersMatch = trimmedExpectedHeaders.every((header, index) => header.toUpperCase() === trimmedHeaders[index]?.toUpperCase());
            if (!headersMatch) {
                throw new Error(`Invalid file format: Header names do not match expected format. Found: ${trimmedHeaders.join(", ")}`);
            }
            // Step 4: Process rows and create product data
            const rows = xlsx_1.default.utils.sheet_to_json(sheet, { header: 1, range: 1 }); // Skip header row
            // Temporary map to store product aggregation
            const productMap = new Map();
            for (const row of rows) {
                const [productName, category, subCategory, modelName, modelDescription, modelPrice, modelFeatures, inventoryQuantity,] = row;
                // Convert possible numbers to string for consistency
                const subCat = await services_1.productService.getSubCategorryByName(String(subCategory));
                if (!subCat) {
                    throw new Error(`Subcategory '${subCategory}' not found.`);
                }
                // Cast productName to string for map key consistency
                const productNameString = String(productName);
                // Check if product already exists in map
                if (!productMap.has(productNameString)) {
                    productMap.set(productNameString, {
                        name: productNameString,
                        subCategoryId: subCat.id, // Assign the subcategory ID
                        models: [],
                    });
                }
                // Prepare model data
                const features = String(modelFeatures)
                    .split(",")
                    .map((feature) => ({ description: feature.trim() }));
                const modelData = {
                    name: String(modelName),
                    description: String(modelDescription),
                    price: parseFloat(String(modelPrice)),
                    features,
                    minimumStock: 10, // Default value
                    inventory: { quantity: parseInt(String(inventoryQuantity)) },
                };
                // Add model to the product (cast productName to string)
                productMap.get(productNameString)?.models.push(modelData);
            }
            // Step 5: Save products into database or through service
            for (const product of productMap.values()) {
                // Directly pass product details as per CreateProductDTO structure
                await services_1.productService.createProduct(product);
            }
            res.status(200).json({ message: "Products uploaded successfully." });
        }
        catch (error) {
            next(error);
        }
    },
    checkout: async (req, res, next) => {
        try {
            const result = await stk_Service_1.StkService.pushStk(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    addReview: async (req, res, next) => {
        try {
            const { productModelId, rating, comment, images } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const review = await services_1.productService.addReview(userId, productModelId, rating, comment, images);
            res.status(201).json(review);
        }
        catch (error) {
            next(error);
        }
    },
    getReviews: async (req, res, next) => {
        try {
            const { productModelId } = req.params;
            const reviews = await services_1.productService.getReviews(productModelId);
            res.status(200).json(reviews);
        }
        catch (error) {
            next(error);
        }
    },
    resondTOReview: async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const { message } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            const review = await services_1.productService.respondToReview(reviewId, message, userId);
            res.status(201).json(review);
        }
        catch (error) {
            next(error);
        }
    },
    getPricePercentages: async (req, res, next) => {
        try {
            const pricePercentages = await services_1.productService.getPricePercentages();
            res.status(200).json(pricePercentages);
        }
        catch (error) {
            next(error);
        }
    },
    createPricePercentage: async (req, res, next) => {
        try {
            const pricePercentages = await services_1.productService.createPricePercentage(req.body);
            res.status(200).json(pricePercentages);
        }
        catch (error) {
            next(error);
        }
    },
    updatePercentagePrice: async (req, res, next) => {
        try {
            const { percentagePriceId } = req.params;
            const { percentage } = req.body;
            const updatedPercentage = await services_1.productService.updatePricePercentage(percentagePriceId, percentage);
            res.status(200).json(updatedPercentage);
        }
        catch (error) {
            next(error);
        }
    },
    moveProductToLive: async (req, res, next) => {
        try {
            const { modelId } = req.params;
            const updatedProduct = await services_1.productService.moveProductToLive(modelId);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    },
    updateFeatureList: async (req, res, next) => {
        try {
            const { modelId } = req.params;
            const updatedProduct = await services_1.productService.updateFeatureList(modelId);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    },
    schedulePriceChange: async (req, res, next) => {
        try {
            const { modelId, subCategoryId, percentage, startDate, endDate, reason } = req.body;
            const updatedProduct = await services_1.productService.schedulePriceChange(modelId, subCategoryId, percentage, new Date(startDate), new Date(endDate), reason);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    },
    updateScheduledPriceChange: async (req, res, next) => {
        try {
            const { pricePercentageId } = req.params;
            const { modelId, subCategoryId, percentage, startDate, endDate, reason } = req.body;
            const updatedProduct = await services_1.productService.updateScheduledPriceChange(pricePercentageId, modelId, subCategoryId, percentage, new Date(startDate), new Date(endDate), reason);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    },
    getScheduledPriceChange: async (req, res, next) => {
        try {
            const { startDate, endDate, isActive } = req.query;
            const filters = {};
            if (startDate) {
                filters.startDate = new Date(startDate);
            }
            if (endDate) {
                filters.endDate = new Date(endDate);
            }
            if (isActive !== undefined) {
                filters.isActive = isActive === "true";
            }
            const scheduledPriceChange = await services_1.productService.getScheduledPriceChanges(filters);
            res.status(200).json(scheduledPriceChange);
        }
        catch (error) {
            next(error);
        }
    },
    // MPESA STK Callback
    callbackURl: async (req, res, next) => {
        try {
            console.log("req", req.body);
            const result = await stk_Service_1.StkService.saveCallbackResult(req.body.stkCallback);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
