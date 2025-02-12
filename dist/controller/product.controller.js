import { productService } from "../services";
import xlsx from "xlsx";
import { StkService } from "../services/mpesa/stk.Service";
export const productController = {
    // Product Handlers
    getAllProducts: async (req, res, next) => {
        try {
            const { searchTerm, categoryIds, subCategoryIds, featureIds, minPrice, maxPrice, page, limit } = req.query;
            const products = await productService.getAllProducts(searchTerm, categoryIds ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds]) : undefined, subCategoryIds ? (Array.isArray(subCategoryIds) ? subCategoryIds : [subCategoryIds]) : undefined, featureIds ? (Array.isArray(featureIds) ? featureIds : [featureIds]) : undefined, minPrice ? parseFloat(minPrice) : undefined, maxPrice ? parseFloat(maxPrice) : undefined, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
            res.status(200).json(products);
        }
        catch (error) {
            next(error);
        }
    },
    getAllProductsModels: async (req, res, next) => {
        try {
            const { searchTerm, categoryIds, subCategoryIds, featureIds, minPrice, maxPrice, page, limit } = req.query;
            const products = await productService.getAllProductsModels(searchTerm, categoryIds ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds]) : undefined, subCategoryIds ? (Array.isArray(subCategoryIds) ? subCategoryIds : [subCategoryIds]) : undefined, featureIds ? (Array.isArray(featureIds) ? featureIds : [featureIds]) : undefined, minPrice ? parseFloat(minPrice) : undefined, maxPrice ? parseFloat(maxPrice) : undefined, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
            res.status(200).json(products);
        }
        catch (error) {
            next(error);
        }
    },
    createProduct: async (req, res, next) => {
        try {
            const { productData } = req.body;
            const product = await productService.createProduct(productData);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    getProduct: async (req, res, next) => {
        try {
            const product = await productService.getProductById(req.params.id);
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    getProductModel: async (req, res, next) => {
        try {
            const product = await productService.getProductModelById(req.params.id);
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    getAllFeatures: async (req, res, next) => {
        try {
            const { categoryId, productId, productModelId } = req.query;
            const product = await productService.getFeature(categoryId, productId, productModelId);
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            const updatedProduct = await productService.updateProduct(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            await productService.deleteProduct(req.params.id);
            res.status(200).json({ message: "Product deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    // Category Handlers
    getAllCategories: async (req, res, next) => {
        try {
            const categories = await productService.getAllCategories();
            res.status(200).json(categories);
        }
        catch (error) {
            next(error);
        }
    },
    createCategory: async (req, res, next) => {
        try {
            const category = await productService.createCategory(req.body);
            res.status(201).json(category);
        }
        catch (error) {
            next(error);
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const updatedCategory = await productService.updateCategory(req.params.id, req.body);
            res.status(200).json(updatedCategory);
        }
        catch (error) {
            next(error);
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            await productService.deleteCategory(req.params.id);
            res.status(200).json({ message: "Category deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    },
    // Subcategory Handlers
    getAllSubCategories: async (req, res, next) => {
        try {
            const subcategories = await productService.getAllSubCategories();
            res.status(200).json(subcategories);
        }
        catch (error) {
            next(error);
        }
    },
    createSubCategory: async (req, res, next) => {
        try {
            const subcategory = await productService.createSubCategory(req.body);
            res.status(201).json(subcategory);
        }
        catch (error) {
            next(error);
        }
    },
    updateSubCategory: async (req, res, next) => {
        try {
            const updatedSubCategory = await productService.updateSubCategory(req.params.id, req.body);
            res.status(200).json(updatedSubCategory);
        }
        catch (error) {
            next(error);
        }
    },
    deleteSubCategory: async (req, res, next) => {
        try {
            await productService.deleteSubCategory(req.params.id);
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
            const updatedInventory = await productService.addStockToProduct(productModelId, quantityToAdd);
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
            const updatedInventory = await productService.updateStock(productModelId, quantityToUpdate);
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
            const currentStock = await productService.checkStock(productModelId);
            res.status(200).json({ currentStock });
        }
        catch (error) {
            next(error);
        }
    },
    getCartItems: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const cartItems = await productService.getCartItems(userId);
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
            const cartItem = await productService.addToCart(userId, productModelId, quantity);
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
            const updatedCartItem = await productService.updateCartItem(userId, productModelId, quantity);
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
            await productService.removeFromCart(userId, cartId);
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
            const wishlistItems = await productService.getWishlistItems(userId);
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
            const wishlistItem = await productService.addToWishlist(userId, productModelId);
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
            await productService.removeFromWishlist(userId, wishlistId);
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
            const { products } = req.body;
            if (!userId) {
                throw new Error("User not authenticated");
            }
            const order = await productService.createOrder(userId, products);
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
            const updatedOrder = await productService.updateOrderStatus(orderId, status);
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
            const orders = await productService.getOrders(userId);
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
            const cancelledOrder = await productService.cancelOrder(orderId, restoreStock);
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
            const order = await productService.getOrder(orderId);
            res.status(200).json(order);
        }
        catch (error) {
            next(error);
        }
    },
    // Delete an order by ID
    deleteOrder: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const result = await productService.deleteOrder(orderId);
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
            const results = await productService.uploadFile(files);
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
            const results = await productService.addProductImages(formattedFiles);
            res.status(200).json(results);
        }
        catch (error) {
            next(error);
        }
    },
    setPrimaryImage: async (req, res, next) => {
        try {
            const { imageId, productModelId } = req.body;
            const product = await productService.setPrimaryImage(imageId, productModelId);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    },
    removeImage: async (req, res, next) => {
        try {
            const { imageId } = req.params;
            const product = await productService.removeImage(imageId);
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
            const workbook = xlsx.readFile(file.tempFilePath);
            const sheetName = workbook.SheetNames[0]; // Assume first sheet is the one we need
            const sheet = workbook.Sheets[sheetName];
            // Step 3: Extract headers and validate them
            const headers = xlsx.utils.sheet_to_json(sheet, {
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
            const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, range: 1 }); // Skip header row
            // Temporary map to store product aggregation
            const productMap = new Map();
            for (const row of rows) {
                const [productName, category, subCategory, modelName, modelDescription, modelPrice, modelFeatures, inventoryQuantity,] = row;
                // Convert possible numbers to string for consistency
                const subCat = await productService.getSubCategorryByName(String(subCategory));
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
                    inventory: { quantity: parseInt(String(inventoryQuantity)) },
                };
                // Add model to the product (cast productName to string)
                productMap.get(productNameString)?.models.push(modelData);
            }
            // Step 5: Save products into database or through service
            for (const product of productMap.values()) {
                // Directly pass product details as per CreateProductDTO structure
                await productService.createProduct(product);
            }
            res.status(200).json({ message: "Products uploaded successfully." });
        }
        catch (error) {
            next(error);
        }
    },
    checkout: async (req, res, next) => {
        try {
            const result = await StkService.pushStk(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    callbackURl: async (req, res, next) => {
        try {
            const result = await StkService.saveCallbackResult(req.body.stkCallback);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
};
