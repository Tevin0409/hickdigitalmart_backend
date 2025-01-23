import express from "express";
import { productService } from "../services";
import { IUserRequest } from "../middleware";

export const productController = {
  // Product Handlers
  getAllProducts: async (
    req: IUserRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { searchTerm, categoryId } = req.query;
      const products = await productService.getAllProducts(
        searchTerm as string | undefined,
        categoryId as string | undefined
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
      const { productId, quantityToAdd } = req.body;

      // Add stock to the product
      const updatedInventory = await productService.addStockToProduct(
        productId,
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
      const { productId, quantityToUpdate } = req.body;
      console.log("product id", productId);

      // Update stock for the product
      const updatedInventory = await productService.updateStock(
        productId,
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
      const { productId } = req.params;

      // Check stock of the product
      const currentStock = await productService.checkStock(productId);

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
      const { productId, quantity } = req.body;
      const cartItem = await productService.addToCart(
        userId,
        productId,
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
      const { quantity } = req.body;
      const updatedCartItem = await productService.updateCartItem(
        userId,
        cartId,
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
      const { productId } = req.body;
      const wishlistItem = await productService.addToWishlist(
        userId,
        productId
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
      const { products } = req.body;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const order = await productService.createOrder(userId, products);
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
};
