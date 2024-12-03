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
      const products = await productService.getAllProducts();
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
      const { productData, inventoryQuantity } = req.body;
      const product = await productService.createProduct(
        productData,
        inventoryQuantity
      );
      res.status(201).json(product);
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
};
