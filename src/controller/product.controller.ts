import express from "express";
import { productService, userService } from "../services";
import { IUserRequest } from "../middleware";
import { FileArray, UploadedFile } from "express-fileupload";
import xlsx from "xlsx";
import { CreateProductDTO } from "../interface/product";
import { StkService } from "../services/mpesa/stk.Service";

export const productController = {
  // Product Handlers
  getAllProducts: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const {
        searchTerm,
        categoryIds,
        subCategoryIds,
        featureIds,
        minPrice,
        maxPrice,
        page,
        limit,
      } = req.query;

      const products = await productService.getAllProducts(
        searchTerm as string | undefined,
        categoryIds
          ? ((Array.isArray(categoryIds)
              ? categoryIds
              : [categoryIds]) as string[])
          : undefined,
        subCategoryIds
          ? ((Array.isArray(subCategoryIds)
              ? subCategoryIds
              : [subCategoryIds]) as string[])
          : undefined,
        featureIds
          ? ((Array.isArray(featureIds)
              ? featureIds
              : [featureIds]) as string[])
          : undefined,
        minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice ? parseFloat(maxPrice as string) : undefined,
        page ? parseInt(page as string, 10) : 1,
        limit ? parseInt(limit as string, 10) : 10
      );

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  getAllProductsModels: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const {
        searchTerm,
        categoryIds,
        subCategoryIds,
        featureIds,
        minPrice,
        maxPrice,
        page,
        limit,
      } = req.query;

      const roleId = req.user?.roleId;

      const products = await productService.getAllProductsModels(
        searchTerm as string | undefined,
        categoryIds
          ? ((Array.isArray(categoryIds)
              ? categoryIds
              : [categoryIds]) as string[])
          : undefined,
        subCategoryIds
          ? ((Array.isArray(subCategoryIds)
              ? subCategoryIds
              : [subCategoryIds]) as string[])
          : undefined,
        featureIds
          ? ((Array.isArray(featureIds)
              ? featureIds
              : [featureIds]) as string[])
          : undefined,
        minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice ? parseFloat(maxPrice as string) : undefined,
        page ? parseInt(page as string, 10) : 1,
        limit ? parseInt(limit as string, 10) : 10,
        roleId
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
  createProduct: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { productData } = req.body;
      const product = await productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },
  getProduct: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },
  getProductModel: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const product = await productService.getProductModelById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },
  getAllFeatures: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { categoryId, productId, productModelId } = req.query;
      const product = await productService.getFeature(
        categoryId as string | undefined,
        productId as string | undefined,
        productModelId as string | undefined
      );
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const updatedProduct = await productService.updateProduct(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  updateProductModdel: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const updatedProduct = await productService.updateProductModel(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Category Handlers
  getAllCategories: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const categories = await productService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },
  createCategory: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const category = await productService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },
  updateCategory: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const updatedCategory = await productService.updateCategory(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  },
  deleteCategory: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await productService.deleteCategory(req.params.id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Subcategory Handlers
  getAllSubCategories: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const subcategories = await productService.getAllSubCategories();
      res.status(200).json(subcategories);
    } catch (error) {
      next(error);
    }
  },
  createSubCategory: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const subcategory = await productService.createSubCategory(req.body);
      res.status(201).json(subcategory);
    } catch (error) {
      next(error);
    }
  },
  updateSubCategory: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const updatedSubCategory = await productService.updateSubCategory(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedSubCategory);
    } catch (error) {
      next(error);
    }
  },
  deleteSubCategory: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await productService.deleteSubCategory(req.params.id);
      res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
  addStockToProduct: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { productModelId, quantityToAdd } = req.body;

      // Add stock to the product
      const updatedInventory = await productService.addStockToProduct(
        productModelId,
        quantityToAdd
      );

      res.status(200).json(updatedInventory);
    } catch (error) {
      next(error);
    }
  },

  // Update stock for a product (e.g., after a sale)
  updateStock: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { productModelId, quantityToUpdate } = req.body;

      // Update stock for the product
      const updatedInventory = await productService.updateStock(
        productModelId,
        quantityToUpdate
      );

      res.status(200).json(updatedInventory);
    } catch (error) {
      next(error);
    }
  },

  // Check stock for a product
  checkStock: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { productModelId } = req.params;

      // Check stock of the product
      const currentStock = await productService.checkStock(productModelId);

      res.status(200).json({ currentStock });
    } catch (error) {
      next(error);
    }
  },
  getCartItems: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const cartItems = await productService.getCartItems(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      next(error);
    }
  },
  addToCart: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const { productModelId, quantity } = req.body;
      const cartItem = await productService.addToCart(
        userId,
        productModelId,
        quantity
      );
      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  },
  updateCartItem: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const cartId = req.params.cartId;
      const { quantity, productModelId } = req.body;
      const updatedCartItem = await productService.updateCartItem(
        userId,
        productModelId,
        quantity
      );
      res.status(200).json(updatedCartItem);
    } catch (error) {
      next(error);
    }
  },
  removeFromCart: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const cartId = req.params.cartId;
      await productService.removeFromCart(userId, cartId);
      res.status(200).json({ message: "Item removed from cart successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Wishlist Handlers
  getWishlistItems: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const wishlistItems = await productService.getWishlistItems(userId);
      res.status(200).json(wishlistItems);
    } catch (error) {
      next(error);
    }
  },
  addToWishlist: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const { productModelId } = req.body;
      const wishlistItem = await productService.addToWishlist(
        userId,
        productModelId
      );
      res.status(201).json(wishlistItem);
    } catch (error) {
      next(error);
    }
  },
  removeFromWishlist: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const wishlistId = req.params.wishlistId;
      await productService.removeFromWishlist(userId, wishlistId);
      res
        .status(200)
        .json({ message: "Item removed from wishlist successfully" });
    } catch (error) {
      next(error);
    }
  },
  createOrder: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const {
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
      } = req.body;

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

      const order = await productService.createOrder(userId, orderData);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },
  createQuotation: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const { message, products } = req.body;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const orderData = {
        products,
        message,
      };

      const order = await productService.createQuotation(userId, orderData);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },
  getUserQuotations: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const order = await productService.getUserQuotations(userId);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },
  getAllQuotations: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { searchTerm, status, page = 1, limit = 10 } = req.query;

      const quotations = await productService.getAllQuotations({
        searchTerm: searchTerm?.toString() || "",
        status: status?.toString() || "",
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });

      res.status(200).json(quotations);
    } catch (error) {
      next(error);
    }
  },
  createAnonymousOrders: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const user = await userService.getUserByEmail("anonymous@yopmail.com");
      const userId = user.id;
      const {
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
      } = req.body;

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

      const order = await productService.createOrder(userId, orderData);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },

  // Update order status
  updateOrderStatus: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const updatedOrder = await productService.updateOrderStatus(
        orderId,
        status
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  },

  // Get orders (for a specific user or all orders)
  getOrders: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const orders = await productService.getOrders(userId);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
  getAllOrders: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // Extract query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.searchTerm as string | undefined;
      const status = req.query.status as string | undefined;

      // Call productService with the extracted parameters
      const orders = await productService.getAllOrders(
        page,
        limit,
        searchTerm,
        status
      );

      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
  // Cancel an order
  cancelOrder: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { orderId } = req.params;
      const { restoreStock } = req.body;

      const cancelledOrder = await productService.cancelOrder(
        orderId,
        restoreStock
      );
      res.status(200).json(cancelledOrder);
    } catch (error) {
      next(error);
    }
  },

  // Get a single order by ID
  getOrder: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { orderId } = req.params;
      const order = await productService.getOrder(orderId);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  getOrderByEmail: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { email } = req.body;
      const orders = await productService.getOrderByEmail(email);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },

  // Delete an order by ID
  deleteOrder: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { orderId } = req.params;
      const result = await productService.deleteOrder(orderId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  uploadFile: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!req.files || !req.files.file) {
        throw new Error("No file uploaded");
      }

      const files = Array.isArray(req.files.file)
        ? req.files.file
        : [req.files.file];

      const results = await productService.uploadFile(files as UploadedFile[]);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  },
  addProductImages: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error("No files uploaded");
      }

      // Convert `req.files` to correct type
      const filesData = req.files as FileArray;

      // Ensure type safety for service
      const formattedFiles: Record<string, UploadedFile | UploadedFile[]> = {};

      for (const key of Object.keys(filesData)) {
        formattedFiles[key] = Array.isArray(filesData[key])
          ? (filesData[key] as UploadedFile[])
          : (filesData[key] as UploadedFile);
      }

      const results = await productService.addProductImages(formattedFiles);

      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  },
  setPrimaryImage: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { imageId, productModelId } = req.body;
      const product = await productService.setPrimaryImage(
        imageId,
        productModelId
      );
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },
  removeImage: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { imageId } = req.params;
      const product = await productService.removeImage(imageId);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },
  uploadBulkProducts: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
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
      })[0] as string[];
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
      const trimmedExpectedHeaders = expectedHeaders.map((header) =>
        header.trim()
      );

      // Validate headers
      const headersMatch = trimmedExpectedHeaders.every(
        (header, index) =>
          header.toUpperCase() === trimmedHeaders[index]?.toUpperCase()
      );

      if (!headersMatch) {
        throw new Error(
          `Invalid file format: Header names do not match expected format. Found: ${trimmedHeaders.join(
            ", "
          )}`
        );
      }

      // Step 4: Process rows and create product data
      const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, range: 1 }) as (
        | string
        | number
      )[][]; // Skip header row

      // Temporary map to store product aggregation
      const productMap = new Map<string, CreateProductDTO>();

      for (const row of rows) {
        const [
          productName,
          category,
          subCategory,
          modelName,
          modelDescription,
          modelPrice,
          modelFeatures,
          inventoryQuantity,
        ] = row as (string | number)[];

        // Convert possible numbers to string for consistency
        const subCat = await productService.getSubCategorryByName(
          String(subCategory)
        );
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
          .map((feature: string) => ({ description: feature.trim() }));
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
        await productService.createProduct(product);
      }

      res.status(200).json({ message: "Products uploaded successfully." });
    } catch (error) {
      next(error);
    }
  },

  checkout: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const result = await StkService.pushStk(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  addReview: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { productModelId, rating, comment, images } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }
      const review = await productService.addReview(
        userId,
        productModelId,
        rating,
        comment,
        images
      );
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  },
  getReviews: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { productModelId } = req.params;
      const reviews = await productService.getReviews(productModelId);
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },
  getAllReviews: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { searchTerm, status, page = 1, limit = 10 } = req.query;
      const reviews = await productService.getAllReviews(
        page ? parseInt(page as string, 10) : 1,
        limit ? parseInt(limit as string, 10) : 10,
        searchTerm as string | undefined,
        status as string | undefined
      );
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },
  resondTOReview: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { reviewId } = req.params;
      const { message } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }
      const review = await productService.respondToReview(
        reviewId,
        message,
        userId
      );
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  },
  getPricePercentages: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const pricePercentages = await productService.getPricePercentages();
      res.status(200).json(pricePercentages);
    } catch (error) {
      next(error);
    }
  },
  createPricePercentage: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const pricePercentages = await productService.createPricePercentage(
        req.body
      );
      res.status(200).json(pricePercentages);
    } catch (error) {
      next(error);
    }
  },
  updatePercentagePrice: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { percentagePriceId } = req.params;
      const { percentage } = req.body;
      const updatedPercentage = await productService.updatePricePercentage(
        percentagePriceId,
        percentage
      );
      res.status(200).json(updatedPercentage);
    } catch (error) {
      next(error);
    }
  },
  moveProductToLive: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { modelId } = req.params;
      const updatedProduct = await productService.moveProductToLive(modelId);
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  updateFeatureList: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { modelId } = req.params;
      const updatedProduct = await productService.updateFeatureList(modelId);
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  schedulePriceChange: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { modelId, subCategoryId, percentage, startDate, endDate, reason } =
        req.body;
      const updatedProduct = await productService.schedulePriceChange(
        modelId,
        subCategoryId,
        percentage,
        new Date(startDate),
        new Date(endDate),
        reason
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  updateScheduledPriceChange: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { pricePercentageId } = req.params;
      const { modelId, subCategoryId, percentage, startDate, endDate, reason } =
        req.body;
      const updatedProduct = await productService.updateScheduledPriceChange(
        pricePercentageId,
        modelId,
        subCategoryId,
        percentage,
        new Date(startDate),
        new Date(endDate),
        reason
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  getScheduledPriceChange: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { startDate, endDate, isActive } = req.query;

      const filters: {
        startDate?: Date;
        endDate?: Date;
        isActive?: boolean;
      } = {};

      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }

      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }

      if (isActive !== undefined) {
        filters.isActive = isActive === "true";
      }

      const scheduledPriceChange =
        await productService.getScheduledPriceChanges(filters);

      res.status(200).json(scheduledPriceChange);
    } catch (error) {
      next(error);
    }
  },
  // MPESA STK Callback
  callbackURl: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<any> => {
    try {
      console.log("req", req.body);
      const result = await StkService.saveCallbackResult(req.body.stkCallback);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
