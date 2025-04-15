"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const claudinary_config_1 = require("../config/claudinary.config");
const prisma = new client_1.PrismaClient();
exports.productService = {
    // Product Services
    getAllProducts: async (searchTerm, categoryIds, subCategoryIds, featureIds, minPrice, maxPrice, page = 1, limit = 10) => {
        try {
            const conditions = [];
            // Search term condition
            if (searchTerm) {
                conditions.push({
                    OR: [
                        { name: { contains: searchTerm, mode: "insensitive" } },
                        {
                            subCategory: {
                                name: { contains: searchTerm, mode: "insensitive" },
                            },
                        },
                        {
                            subCategory: {
                                category: {
                                    name: { contains: searchTerm, mode: "insensitive" },
                                },
                            },
                        },
                        {
                            models: {
                                some: {
                                    OR: [
                                        { name: { contains: searchTerm, mode: "insensitive" } },
                                        {
                                            description: {
                                                contains: searchTerm,
                                                mode: "insensitive",
                                            },
                                        },
                                        {
                                            features: {
                                                some: {
                                                    description: {
                                                        contains: searchTerm,
                                                        mode: "insensitive",
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                });
            }
            // Filter by multiple categories
            if (categoryIds && categoryIds.length > 0) {
                conditions.push({
                    subCategory: {
                        categoryId: { in: categoryIds },
                    },
                });
            }
            // Filter by multiple subcategories
            if (subCategoryIds && subCategoryIds.length > 0) {
                conditions.push({
                    subCategoryId: { in: subCategoryIds },
                });
            }
            // Filter by multiple features
            if (featureIds && featureIds.length > 0) {
                conditions.push({
                    models: {
                        some: {
                            features: {
                                some: {
                                    id: { in: featureIds },
                                },
                            },
                        },
                    },
                });
            }
            // Filter by price range
            if (minPrice !== undefined || maxPrice !== undefined) {
                conditions.push({
                    models: {
                        some: {
                            price: {
                                gte: minPrice ?? 0, // Greater than or equal to minPrice, default to 0
                                lte: maxPrice ?? Number.MAX_SAFE_INTEGER, // Less than or equal to maxPrice
                            },
                        },
                    },
                });
            }
            // Construct final where condition
            const whereCondition = conditions.length > 0 ? { AND: conditions } : {};
            // Get total matching products count
            const totalResults = await prisma.product.count({
                where: whereCondition,
            });
            // Calculate total pages
            const totalPages = Math.ceil(totalResults / limit);
            // Fetch paginated products
            const products = await prisma.product.findMany({
                where: whereCondition,
                include: {
                    subCategory: { include: { category: true } },
                    models: {
                        // where: {
                        //   status: "visible",
                        // },
                        include: {
                            features: true,
                            inventory: true,
                            images: true,
                            PricePercentage: {
                                include: {
                                    role: { select: { name: true } },
                                },
                            },
                            Review: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            role: {
                                                select: { name: true },
                                            },
                                        },
                                    },
                                    images: true,
                                    ReviewResponse: {
                                        include: {
                                            user: {
                                                select: {
                                                    firstName: true,
                                                    lastName: true,
                                                    email: true,
                                                    role: {
                                                        select: { name: true },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            });
            return {
                page,
                limit,
                totalPages,
                totalResults,
                results: products,
            };
        }
        catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },
    getAllProductsModels: async (searchTerm, categoryIds, subCategoryIds, featureIds, minPrice, maxPrice, page = 1, limit = 10) => {
        try {
            const conditions = [];
            conditions.push({ status: "visible" });
            // Search term condition
            if (searchTerm) {
                conditions.push({
                    OR: [
                        { name: { contains: searchTerm, mode: "insensitive" } },
                        { description: { contains: searchTerm, mode: "insensitive" } },
                        {
                            product: {
                                name: { contains: searchTerm, mode: "insensitive" },
                            },
                        },
                        {
                            product: {
                                subCategory: {
                                    name: { contains: searchTerm, mode: "insensitive" },
                                },
                            },
                        },
                        {
                            product: {
                                subCategory: {
                                    category: {
                                        name: { contains: searchTerm, mode: "insensitive" },
                                    },
                                },
                            },
                        },
                        {
                            features: {
                                some: {
                                    description: {
                                        contains: searchTerm,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    ],
                });
            }
            // Filter by multiple categories
            if (categoryIds && categoryIds.length > 0) {
                conditions.push({
                    product: {
                        subCategory: {
                            categoryId: { in: categoryIds },
                        },
                    },
                });
            }
            // Filter by multiple subcategories
            if (subCategoryIds && subCategoryIds.length > 0) {
                conditions.push({
                    product: {
                        subCategoryId: { in: subCategoryIds },
                    },
                });
            }
            // Filter by multiple features
            if (featureIds && featureIds.length > 0) {
                conditions.push({
                    features: {
                        some: {
                            id: { in: featureIds },
                        },
                    },
                });
            }
            // Filter by price range
            if (minPrice !== undefined || maxPrice !== undefined) {
                conditions.push({
                    price: {
                        gte: minPrice ?? 0, // Greater than or equal to minPrice, default to 0
                        lte: maxPrice ?? Number.MAX_SAFE_INTEGER, // Less than or equal to maxPrice
                    },
                });
            }
            // Construct final where condition
            const whereCondition = conditions.length > 0 ? { AND: conditions } : {};
            // Get total matching models count
            const totalResults = await prisma.productModel.count({
                where: whereCondition,
            });
            // Calculate total pages
            const totalPages = Math.ceil(totalResults / limit);
            // Fetch paginated product models
            const models = await prisma.productModel.findMany({
                where: whereCondition,
                include: {
                    product: {
                        include: {
                            subCategory: { include: { category: true } },
                        },
                    },
                    features: true,
                    inventory: true,
                    images: true,
                    PricePercentage: {
                        include: {
                            role: { select: { name: true } },
                        },
                    },
                    Review: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: {
                                        select: { name: true },
                                    },
                                },
                            },
                            images: true,
                            ReviewResponse: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            role: {
                                                select: { name: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            });
            return {
                page,
                limit,
                totalPages,
                totalResults,
                results: models,
            };
        }
        catch (error) {
            console.error("Error fetching product models:", error);
            throw error;
        }
    },
    getProductById: async (id) => {
        try {
            return await prisma.product.findUnique({
                where: { id },
                include: {
                    subCategory: {
                        include: { category: true },
                    },
                    models: {
                        include: {
                            features: true,
                            inventory: true,
                            images: true,
                            Review: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            role: {
                                                select: { name: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to fetch product: " + error.message);
        }
    },
    getProductModelById: async (id) => {
        try {
            return await prisma.productModel.findUnique({
                where: { id },
                include: {
                    features: true,
                    inventory: true,
                    images: true,
                    PricePercentage: {
                        include: {
                            role: { select: { name: true } },
                        },
                    },
                    Review: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: {
                                        select: { name: true },
                                    },
                                },
                            },
                            images: true,
                            ReviewResponse: {
                                include: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            role: {
                                                select: { name: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to fetch product model : " + error.message);
        }
    },
    getFeature: async (categoryId, productId, productModelId) => {
        const conditions = [];
        if (categoryId) {
            conditions.push({
                model: {
                    product: {
                        subCategory: {
                            categoryId: categoryId,
                        },
                    },
                },
            });
        }
        if (productId) {
            conditions.push({
                model: {
                    productId: productId,
                },
            });
        }
        if (productModelId) {
            conditions.push({
                modelId: productModelId,
            });
        }
        return await prisma.productFeature.findMany({
            where: conditions.length > 0 ? { OR: conditions } : undefined,
            include: {
                model: {
                    include: {
                        product: {
                            include: {
                                subCategory: {
                                    include: {
                                        category: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    },
    createProduct: async (data) => {
        try {
            const categoryExist = await prisma.subCategory.findUnique({
                where: { id: data.subCategoryId },
            });
            if (!categoryExist) {
                throw new Error("Subcategory not found");
            }
            const existingProductModel = await prisma.productModel.findFirst({
                where: {
                    name: { in: data.models.map((model) => model.name) }, // map the names properly
                },
            });
            if (existingProductModel) {
                throw new middleware_1.AppError(400, `${existingProductModel.name} already exists`);
            }
            return await prisma.product.create({
                data: {
                    name: data.name,
                    subCategoryId: data.subCategoryId,
                    models: {
                        create: data.models.map((model) => ({
                            name: model.name,
                            description: model.description,
                            price: model.price,
                            minimumStock: model.minimumStock,
                            features: {
                                create: model.features.map((feature) => ({
                                    description: feature.description,
                                })),
                            },
                            inventory: {
                                create: { quantity: model.inventory.quantity || 0 },
                            },
                        })),
                    },
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to create product: " + error.message);
        }
    },
    updateProduct: async (id, data) => {
        try {
            return await prisma.product.update({
                where: { id },
                data: {
                    name: data.name,
                    subCategoryId: data.subCategoryId,
                    models: {
                        update: data.models.map((model) => ({
                            where: { id: model.id },
                            data: {
                                name: model.name,
                                description: model.description,
                                price: model.price,
                                features: {
                                    upsert: model.features.map((feature) => ({
                                        where: { id: feature.id || "" },
                                        update: { description: feature.description },
                                        create: { description: feature.description },
                                    })),
                                },
                                inventory: {
                                    update: { quantity: model.inventory.quantity || 0 },
                                },
                            },
                        })),
                    },
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to update product: " + error.message);
        }
    },
    updateProductModel: async (id, data) => {
        try {
            return await prisma.productModel.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    ...(data.features && data.features.length > 0
                        ? {
                            features: {
                                update: data.features.map((feature) => ({
                                    where: { id: feature.id },
                                    data: { description: feature.description },
                                })),
                            },
                        }
                        : {}),
                    ...(data.inventory
                        ? {
                            inventory: {
                                update: { quantity: data.inventory.quantity },
                            },
                        }
                        : {}),
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, `Failed to update product: ${error.message}`);
        }
    },
    deleteProduct: async (id) => {
        try {
            return await prisma.product.delete({ where: { id } });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to delete product");
        }
    },
    // Category Services
    getAllCategories: async () => {
        try {
            return await prisma.category.findMany();
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve categories");
        }
    },
    createCategory: async (data) => {
        try {
            return await prisma.category.create({ data });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to create category" + error.message);
        }
    },
    updateCategory: async (id, data) => {
        try {
            return await prisma.category.update({ where: { id }, data });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to update category");
        }
    },
    deleteCategory: async (id) => {
        try {
            return await prisma.category.delete({ where: { id } });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to delete category");
        }
    },
    // Subcategory Services
    getAllSubCategories: async () => {
        try {
            return await prisma.subCategory.findMany();
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve subcategories");
        }
    },
    createSubCategory: async (data) => {
        try {
            return await prisma.subCategory.create({ data });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to create subcategory");
        }
    },
    getSubCategorryByName: async (name) => {
        try {
            return await prisma.subCategory.findFirst({ where: { name } });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to create subcategory");
        }
    },
    updateSubCategory: async (id, data) => {
        try {
            return await prisma.subCategory.update({ where: { id }, data });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to update subcategory");
        }
    },
    deleteSubCategory: async (id) => {
        try {
            return await prisma.subCategory.delete({ where: { id } });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to delete subcategory");
        }
    },
    addStockToProduct: async (modelId, quantityToAdd) => {
        try {
            // Update inventory for a specific model
            const inventory = await prisma.inventory.updateMany({
                where: {
                    modelId: modelId, // Update inventory for the specific model
                },
                data: {
                    quantity: {
                        increment: quantityToAdd, // Increment the existing stock by the given quantity
                    },
                },
            });
            if (inventory.count === 0) {
                throw new middleware_1.AppError(404, "Inventory not found for this product model");
            }
            return inventory;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to add stock to product model: " + error.message);
        }
    },
    // Update stock (e.g., decrease stock after a sale)
    updateStock: async (modelId, quantityToUpdate) => {
        try {
            // Find inventory by modelId (for specific product model)
            const inventory = await prisma.inventory.findFirst({
                where: {
                    modelId: modelId, // Use productModelId to find the inventory for the specific model
                },
            });
            if (!inventory) {
                throw new middleware_1.AppError(404, "Inventory not found for this product model");
            }
            // Update inventory quantity for the specific product model
            const updatedInventory = await prisma.inventory.update({
                where: {
                    id: inventory.id, // Use the id of the found inventory
                },
                data: {
                    quantity: quantityToUpdate, // Set the updated quantity
                },
            });
            return updatedInventory;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to update stock for the product model: " + error.message);
        }
    },
    checkStock: async (modelId) => {
        try {
            const inventory = await prisma.inventory.findFirst({
                where: {
                    modelId: modelId, // Use productModelId to check stock for the specific model
                },
            });
            if (!inventory) {
                throw new middleware_1.AppError(404, "No inventory record found for this product model");
            }
            return inventory.quantity;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve stock information for the product model: " +
                error.message);
        }
    },
    // Wishlist Services
    addToWishlist: async (userId, productModelId) => {
        try {
            // Check if the wishlist entry exists
            const existingEntry = await prisma.wishlist.findFirst({
                where: { userId, productModelId },
            });
            if (existingEntry) {
                // If the entry exists, delete it
                await prisma.wishlist.delete({
                    where: { id: existingEntry.id },
                });
                return { message: "Wishlist item removed." };
            }
            else {
                // If the entry does not exist, add a new one
                await prisma.wishlist.create({
                    data: {
                        userId,
                        productModelId,
                    },
                });
                return { message: "Wishlist item added." };
            }
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to manage wishlist: " + error.message);
        }
    },
    removeFromWishlist: async (userId, wishlistId) => {
        try {
            return await prisma.wishlist.delete({
                where: {
                    userId,
                    id: wishlistId,
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to remove from wishlist: " + error.message);
        }
    },
    getWishlistItems: async (userId) => {
        try {
            return await prisma.wishlist.findMany({
                where: { userId },
                include: {
                    productModel: {
                        include: {
                            images: true,
                            features: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to fetch wishlist: " + error.message);
        }
    },
    // Cart Services
    addToCart: async (userId, productModelId, quantity) => {
        try {
            const existingCartItem = await prisma.cart.findFirst({
                where: { userId, productModelId },
            });
            if (existingCartItem) {
                return await prisma.cart.update({
                    where: { id: existingCartItem.id },
                    data: { quantity: { increment: quantity } },
                });
            }
            return await prisma.cart.create({
                data: {
                    userId,
                    productModelId,
                    quantity,
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to add to cart: " + error.message);
        }
    },
    removeFromCart: async (userId, cartId) => {
        try {
            return await prisma.cart.delete({
                where: {
                    userId,
                    id: cartId,
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to remove from cart: " + error.message);
        }
    },
    updateCartItem: async (userId, productModelId, quantity) => {
        try {
            return await prisma.cart.updateMany({
                where: {
                    userId,
                    productModelId,
                },
                data: {
                    quantity,
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to update cart item: " + error.message);
        }
    },
    getCartItems: async (userId) => {
        return await prisma.cart.findMany({
            where: { userId },
            include: {
                productModel: {
                    include: {
                        images: true,
                        features: true,
                    },
                },
            },
        });
    },
    createOrder: async (userId, orderData) => {
        try {
            let orderPrice = 0;
            const { first_name, last_name, company_name, street_address, apartment, town, phone_number, email, products, isVat, } = orderData;
            // Check stock and calculate order price
            for (const { productModelId, quantity } of products) {
                const inventory = await prisma.inventory.findUnique({
                    where: { modelId: productModelId },
                    include: { model: true },
                });
                if (!inventory || inventory.quantity < quantity) {
                    throw new middleware_1.AppError(400, `Insufficient stock for product model ID: ${productModelId}`);
                }
                // Calculate order price
                orderPrice += inventory.model.price * quantity;
            }
            const vat = isVat ? orderPrice * 0.16 : 0; // Apply VAT only if isVat is true
            const total = orderPrice + vat;
            // Create the order and update inventory
            return await prisma.$transaction(async (tx) => {
                const order = await tx.order.create({
                    data: {
                        userId,
                        first_name,
                        last_name,
                        company_name,
                        street_address,
                        apartment,
                        town,
                        phone_number,
                        email,
                        orderPrice,
                        vat,
                        total,
                        orderItems: {
                            create: products.map(({ productModelId, quantity }) => ({
                                productModel: { connect: { id: productModelId } },
                                quantity,
                            })),
                        },
                    },
                    include: { orderItems: true },
                });
                // Reduce inventory
                // for (const { productModelId, quantity } of products) {
                //   await tx.inventory.update({
                //     where: { modelId: productModelId },
                //     data: { quantity: { decrement: quantity } },
                //   });
                // }
                return order;
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to create order: " + error.message);
        }
    },
    updateOrderStatus: async (orderId, status) => {
        try {
            return await prisma.order.update({
                where: { id: orderId },
                data: { status },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to update order status: " + error.message);
        }
    },
    getOrders: async (userId) => {
        try {
            return await prisma.order.findMany({
                where: userId ? { userId } : {},
                include: {
                    orderItems: {
                        include: {
                            productModel: {
                                include: {
                                    images: true,
                                    features: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve orders: " + error.message);
        }
    },
    getAllOrders: async (page = 1, limit = 10, searchTerm, status) => {
        try {
            const skip = (page - 1) * limit;
            // Construct search filters
            const filters = {};
            if (status) {
                filters.status = status;
            }
            if (searchTerm) {
                filters.OR = [
                    { phone_number: { contains: searchTerm, mode: "insensitive" } },
                    { email: { contains: searchTerm, mode: "insensitive" } },
                    { first_name: { contains: searchTerm, mode: "insensitive" } },
                    { last_name: { contains: searchTerm, mode: "insensitive" } },
                ];
            }
            // Get total order count with filters
            const totalResults = await prisma.order.count({ where: filters });
            // Fetch paginated orders
            const orders = await prisma.order.findMany({
                where: filters,
                include: {
                    orderItems: {
                        include: {
                            productModel: {
                                include: {
                                    images: true,
                                    features: true,
                                },
                            },
                        },
                    },
                },
                skip,
                take: limit,
            });
            const totalPages = Math.ceil(totalResults / limit);
            return {
                page,
                limit,
                totalPages,
                totalResults,
                results: orders,
            };
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve orders: " + error.message);
        }
    },
    cancelOrder: async (orderId, restoreStock = false) => {
        try {
            return await prisma.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { orderItems: true },
                });
                if (!order) {
                    throw new middleware_1.AppError(404, "Order not found");
                }
                if (restoreStock) {
                    for (const { productModelId, quantity } of order.orderItems) {
                        // Changed productId to productModelId
                        await tx.inventory.updateMany({
                            where: { modelId: productModelId }, // Updated to use productModelId
                            data: { quantity: { increment: quantity } },
                        });
                    }
                }
                return await tx.order.update({
                    where: { id: orderId },
                    data: { status: "Cancelled" },
                });
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to cancel order: " + error.message);
        }
    },
    getOrder: async (orderId) => {
        try {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    orderItems: {
                        include: {
                            productModel: true, // Updated to reference ProductModel
                        },
                    },
                },
            });
            if (!order) {
                throw new middleware_1.AppError(404, "Order not found");
            }
            return order;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve order: " + error.message);
        }
    },
    getOrderByEmail: async (email) => {
        try {
            const orders = await prisma.order.findMany({
                where: { email },
                include: {
                    transactions: true,
                    orderItems: {
                        include: {
                            productModel: true,
                        },
                    },
                },
            });
            if (!orders) {
                throw new middleware_1.AppError(404, "Order not found");
            }
            return orders;
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to retrieve orders: " + error.message);
        }
    },
    // Delete an order
    deleteOrder: async (orderId) => {
        try {
            return await prisma.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { orderItems: true },
                });
                if (!order) {
                    throw new middleware_1.AppError(404, "Order not found");
                }
                // Restore stock if needed (when deleting an order)
                for (const { productModelId, quantity } of order.orderItems) {
                    // Changed productId to productModelId
                    await tx.inventory.updateMany({
                        where: { modelId: productModelId }, // Updated to use productModelId
                        data: { quantity: { increment: quantity } },
                    });
                }
                // Delete the order
                await tx.order.delete({
                    where: { id: orderId },
                });
                return { message: "Order deleted successfully" };
            });
        }
        catch (error) {
            throw new middleware_1.AppError(500, "Failed to delete order: " + error.message);
        }
    },
    uploadFile: async (files) => {
        const filesArray = Array.isArray(files) ? files : [files];
        const imageUrls = [];
        const publicIds = [];
        // Process each file
        filesArray.forEach((file, index) => {
            imageUrls.push(file.tempFilePath);
            publicIds.push(`products`);
        });
        const uploadResults = await (0, claudinary_config_1.uploadImages)(imageUrls, publicIds);
        return uploadResults;
    },
    addProductImages: async (filesData) => {
        try {
            if (!filesData || Object.keys(filesData).length === 0) {
                throw new Error("No files uploaded");
            }
            const savedImages = [];
            // Loop through each productModelId dynamically
            for (const productModelId of Object.keys(filesData)) {
                const filesArray = Array.isArray(filesData[productModelId])
                    ? filesData[productModelId]
                    : [filesData[productModelId]];
                // Extract file paths for Cloudinary upload
                const imageUrls = filesArray.map((file) => file.tempFilePath); // Express-fileupload uses tempFilePath
                const publicIds = filesArray.map(() => `products`);
                // Upload images to Cloudinary
                const uploadResults = await (0, claudinary_config_1.uploadImages)(imageUrls, publicIds);
                // Check if there's already a primary image for this productModelId
                const existingPrimaryImageCount = await prisma.productImage.count({
                    where: {
                        productModelId,
                        isPrimary: true,
                    },
                });
                // Set `isPrimary` for the first image if no primary image exists, otherwise set all to false
                const images = await Promise.all(uploadResults.map(async (upload, index) => {
                    if (!upload) {
                        throw new Error("Failed to upload image.");
                    }
                    // If no primary image exists, mark the first image as primary
                    const isPrimary = existingPrimaryImageCount === 0 && index === 0;
                    console.log("productModelId", isPrimary);
                    // Now create the image in the database, all images after the first will be `isPrimary: false`
                    return prisma.productImage.create({
                        data: {
                            productModelId,
                            uploadUrl: upload.uploadUrl,
                            optimizeUrl: upload.optimizeUrl,
                            autoCropUrl: upload.autoCropUrl,
                            isPrimary,
                        },
                    });
                }));
                savedImages.push(...images);
            }
            return { message: "Images uploaded successfully", images: savedImages };
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while uploading images.");
        }
    },
    setPrimaryImage: async (imageId, productModelId) => {
        try {
            const existingPrimaryImage = await prisma.productImage.findFirst({
                where: {
                    productModelId,
                    isPrimary: true,
                },
            });
            if (existingPrimaryImage) {
                await prisma.productImage.update({
                    where: {
                        id: existingPrimaryImage.id,
                    },
                    data: {
                        isPrimary: false,
                    },
                });
            }
            const updatedImage = await prisma.productImage.update({
                where: {
                    id: imageId,
                },
                data: {
                    isPrimary: true,
                },
            });
            return {
                message: "Primary image updated successfully",
                image: updatedImage,
            };
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while setting the primary image.");
        }
    },
    removeImage: async (imageId) => {
        try {
            // Step 1: Find the image to be deleted
            const imageToDelete = await prisma.productImage.findUnique({
                where: { id: imageId },
            });
            if (!imageToDelete) {
                throw new Error("Image not found");
            }
            if (imageToDelete.isPrimary) {
                const anotherImage = await prisma.productImage.findFirst({
                    where: {
                        productModelId: imageToDelete.productModelId,
                        NOT: { id: imageId },
                    },
                });
                if (anotherImage) {
                    await prisma.productImage.update({
                        where: { id: anotherImage.id },
                        data: { isPrimary: true },
                    });
                }
            }
            await prisma.productImage.delete({
                where: { id: imageId },
            });
            return { message: "Image removed successfully" };
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while removing the image.");
        }
    },
    addReview: async (userId, productModelId, rating, comment, images) => {
        try {
            // 1. Check if the product model exists
            const productModel = await prisma.productModel.findUnique({
                where: { id: productModelId },
            });
            if (!productModel) {
                throw new Error("Product model not found.");
            }
            // 2. Check if the user has ordered this product model
            const hasOrdered = await prisma.orderItem.findFirst({
                where: {
                    productModelId,
                    order: {
                        userId,
                    },
                },
            });
            if (!hasOrdered) {
                // throw new Error("You can only review products you've purchased.");
            }
            // 3. Create the review
            const review = await prisma.review.create({
                data: {
                    userId,
                    productModelId,
                    rating,
                    comment,
                },
            });
            // 4. Attach review images
            if (images?.length) {
                await prisma.reviewImage.createMany({
                    data: images.map((img) => ({
                        reviewId: review.id,
                        uploadUrl: img.uploadUrl,
                        optimizeUrl: img.optimizeUrl ?? null,
                        isPrimary: img.isPrimary ?? false,
                    })),
                });
            }
            return review;
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while adding the review.");
        }
    },
    getReviews: async (productModelId) => {
        try {
            const reviews = await prisma.review.findMany({
                where: { productModelId },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: {
                                select: { name: true },
                            },
                        },
                    },
                    images: true,
                    ReviewResponse: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    role: {
                                        select: { name: true },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            return reviews;
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while fetching the reviews.");
        }
    },
    respondToReview: async (reviewId, message, userId) => {
        try {
            const review = await prisma.review.findUnique({
                where: { id: reviewId },
            });
            if (!review) {
                throw new Error("Review not found.");
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { role: true },
            });
            if (!user || !user.role) {
                throw new Error("User not found.");
            }
            if (!user || !["ADMIN", "SUDO"].includes(user.role?.name)) {
                throw new Error("Only admins  users can respond to reviews.");
            }
            const existingResponse = await prisma.reviewResponse.findUnique({
                where: { reviewId },
            });
            if (existingResponse) {
                return await prisma.reviewResponse.update({
                    where: { reviewId },
                    data: {
                        message,
                        userId,
                    },
                });
            }
            return await prisma.reviewResponse.create({
                data: {
                    reviewId,
                    userId,
                    message,
                },
            });
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while responding to the review.");
        }
    },
    getPricePercentages: async () => {
        try {
            return await prisma.pricePercentage.findMany({
                include: { role: { select: { name: true } } },
            });
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while fetching price percentages.");
        }
    },
    createPricePercentage: async (data) => {
        try {
            const pricePercentages = await prisma.pricePercentage.createMany({
                data,
                skipDuplicates: true, // optional
            });
            return pricePercentages;
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while creating price percentages.");
        }
    },
    updatePricePercentage: async (percentagePriceId, percentage) => {
        try {
            const updated = await prisma.pricePercentage.update({
                where: { id: percentagePriceId },
                data: {
                    percentage,
                    updatedAt: new Date(),
                },
            });
            return updated;
        }
        catch (error) {
            throw new Error(error.message ||
                "An error occurred while updating the price percentage.");
        }
    },
    moveProductToLive: async (modelId) => {
        try {
            const productModel = await prisma.productModel.findUnique({
                where: { id: modelId },
                include: {
                    product: {
                        include: {
                            subCategory: {
                                include: {
                                    category: true,
                                },
                            },
                        },
                    },
                    inventory: true,
                    images: true,
                    features: true,
                    PricePercentage: {
                        include: {
                            role: true,
                        },
                    },
                },
            });
            if (!productModel) {
                throw new Error("Product model not found.");
            }
            // Validation checks
            const hasImage = productModel.images.length > 0;
            const hasFeature = productModel.features.length > 0;
            const hasPricePercent = productModel.PricePercentage.length > 0;
            const hasSufficientInventory = productModel.inventory &&
                productModel.inventory.quantity >= productModel.minimumStock;
            if (!hasImage) {
                throw new Error("At least one image is required.");
            }
            if (!hasFeature) {
                throw new Error("At least one feature is required.");
            }
            if (!hasPricePercent) {
                throw new Error("At least one price percentage is required.");
            }
            if (!hasSufficientInventory) {
                throw new Error("Inventory must be greater than or equal to minimum stock.");
            }
            // Update status to "VISIBLE"
            const updatedModel = await prisma.productModel.update({
                where: { id: modelId },
                data: {
                    status: "visible",
                },
            });
            return updatedModel;
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while publishing the product model.");
        }
    },
    updateFeatureList: async (modelId) => {
        try {
            // Get the current value of isFeatured
            const existingModel = await prisma.productModel.findUnique({
                where: { id: modelId },
                select: { isFeatured: true },
            });
            if (!existingModel) {
                throw new Error("Product model not found.");
            }
            // Toggle isFeatured
            const updatedModel = await prisma.productModel.update({
                where: { id: modelId },
                data: {
                    isFeatured: !existingModel.isFeatured,
                },
            });
            return updatedModel;
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while updating the feature list.");
        }
    },
    schedulePriceChange: async (modelId, subCategoryId, percentage, startDate, endDate, reason) => {
        try {
            // Ensure exactly one target is provided
            if ((modelId && subCategoryId) || (!modelId && !subCategoryId)) {
                throw new Error("Provide either modelId or subCategoryId, but not both.");
            }
            if (percentage === undefined ||
                startDate === undefined ||
                endDate === undefined) {
                throw new Error("Percentage, startDate, and endDate are required for scheduling.");
            }
            const data = {
                percentage,
                startsAt: startDate,
                endsAt: endDate,
                reason,
            };
            if (modelId) {
                data.productModelId = modelId;
            }
            else if (subCategoryId) {
                data.subCategoryId = subCategoryId;
            }
            const scheduledChange = await prisma.scheduledPriceChange.create({
                data,
            });
            return scheduledChange;
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while scheduling the price change.");
        }
    },
    updateScheduledPriceChange: async (priceChangeId, modelId, subCategoryId, percentage, startDate, endDate, reason) => {
        try {
            // Ensure only one of modelId or subCategoryId is provided
            if ((modelId && subCategoryId) || (!modelId && !subCategoryId)) {
                throw new Error("Provide either modelId or subCategoryId, but not both.");
            }
            const updateData = {};
            if (modelId) {
                updateData.productModelId = modelId;
                updateData.subCategoryId = null; // Clear other if switching
            }
            else if (subCategoryId) {
                updateData.subCategoryId = subCategoryId;
                updateData.productModelId = null; // Clear other if switching
            }
            if (percentage !== undefined) {
                updateData.percentage = percentage;
            }
            if (startDate !== undefined) {
                updateData.startsAt = startDate;
            }
            if (endDate !== undefined) {
                updateData.endsAt = endDate;
            }
            if (reason !== undefined) {
                updateData.reason = reason;
            }
            const updatedChange = await prisma.scheduledPriceChange.update({
                where: { id: priceChangeId },
                data: updateData,
            });
            return updatedChange;
        }
        catch (error) {
            throw new Error(error.message ||
                "An error occurred while updating the scheduled price change.");
        }
    },
    getScheduledPriceChanges: async (filters) => {
        try {
            const { startDate, endDate, isActive } = filters || {};
            const whereClause = {};
            if (startDate && endDate) {
                // Filter where schedule overlaps the range
                whereClause.OR = [
                    {
                        startsAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    {
                        endsAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    {
                        AND: [
                            { startsAt: { lte: startDate } },
                            { endsAt: { gte: endDate } },
                        ],
                    },
                ];
            }
            if (isActive !== undefined) {
                const now = new Date();
                if (isActive) {
                    whereClause.startsAt = { lte: now };
                    whereClause.endsAt = { gte: now };
                }
                else {
                    whereClause.OR = [
                        { startsAt: { gt: now } },
                        { endsAt: { lt: now } },
                    ];
                }
            }
            const scheduledChanges = await prisma.scheduledPriceChange.findMany({
                where: whereClause,
                orderBy: {
                    startsAt: 'asc',
                },
                include: {
                    productModel: true,
                    subCategory: true,
                },
            });
            return scheduledChanges;
        }
        catch (error) {
            throw new Error(error.message || "An error occurred while fetching scheduled price changes.");
        }
    }
};
