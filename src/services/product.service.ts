import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware";
import {
  CreateProductDTO,
  UpdateProductDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from "../interface/product";

const prisma = new PrismaClient();

export const productService = {
  // Product Services
  getAllProducts: async () => {
    return prisma.product.findMany({
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
        features: true,
        inventory: true,
      },
    });
  },

  createProduct: async (data: CreateProductDTO, inventoryQuantity: number) => {
    try {
      // Explicitly type 'feature' as an object with 'description' property
      return await prisma.product.create({
        data: {
          name: data.name,
          subCategoryId: data.subCategoryId,
          features: {
            create: data.features.map((feature: { description: string }) => ({
              description: feature.description,
            })),
          },
          inventory: {
            create: {
              quantity: inventoryQuantity || 0,
            },
          },
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to create product" + error.message);
    }
  },

  updateProduct: async (id: string, data: any) => {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          subCategoryId: data.subCategoryId,
          features: {
            upsert: data.features.map((feature: { description: string }) => ({
              where: { description: feature.description },
              update: { description: feature.description },
              create: { description: feature.description },
            })),
          },
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to update product" + error.message);
    }
  },

  deleteProduct: async (id: string) => {
    try {
      return await prisma.product.delete({ where: { id } });
    } catch (error) {
      throw new AppError(500, "Failed to delete product");
    }
  },

  // Category Services
  getAllCategories: async () => {
    try {
      return await prisma.category.findMany();
    } catch (error) {
      throw new AppError(500, "Failed to retrieve categories");
    }
  },

  createCategory: async (data: CreateCategoryDTO) => {
    try {
      return await prisma.category.create({ data });
    } catch (error: any) {
      throw new AppError(500, "Failed to create category" + error.message);
    }
  },

  updateCategory: async (id: string, data: UpdateCategoryDTO) => {
    try {
      return await prisma.category.update({ where: { id }, data });
    } catch (error) {
      throw new AppError(500, "Failed to update category");
    }
  },

  deleteCategory: async (id: string) => {
    try {
      return await prisma.category.delete({ where: { id } });
    } catch (error) {
      throw new AppError(500, "Failed to delete category");
    }
  },

  // Subcategory Services
  getAllSubCategories: async () => {
    try {
      return await prisma.subCategory.findMany();
    } catch (error) {
      throw new AppError(500, "Failed to retrieve subcategories");
    }
  },

  createSubCategory: async (data: CreateSubCategoryDTO) => {
    try {
      return await prisma.subCategory.create({ data });
    } catch (error) {
      throw new AppError(500, "Failed to create subcategory");
    }
  },

  updateSubCategory: async (id: string, data: UpdateSubCategoryDTO) => {
    try {
      return await prisma.subCategory.update({ where: { id }, data });
    } catch (error) {
      throw new AppError(500, "Failed to update subcategory");
    }
  },

  deleteSubCategory: async (id: string) => {
    try {
      return await prisma.subCategory.delete({ where: { id } });
    } catch (error) {
      throw new AppError(500, "Failed to delete subcategory");
    }
  },

  addStockToProduct: async (productId: string, quantityToAdd: number) => {
    try {
      const inventory = await prisma.inventory.updateMany({
        where: {
          productId,
        },
        data: {
          quantity: {
            increment: quantityToAdd, // Increment the existing stock by the given quantity
          },
        },
      });

      if (inventory.count === 0) {
        throw new AppError(404, "Inventory not found for this product");
      }

      return inventory;
    } catch (error: any) {
      throw new AppError(500, "Failed to add stock to product" + error.message);
    }
  },

  // Update stock (e.g., decrease stock after a sale)
  updateStock: async (productId: string, quantityToUpdate: number) => {
    try {
      const inventory = await prisma.inventory.updateMany({
        where: {
          productId,
        },
        data: {
          quantity: quantityToUpdate,
        },
      });

      if (inventory.count === 0) {
        throw new AppError(404, "Inventory not found for this product");
      }

      return inventory;
    } catch (error: any) {
      throw new AppError(500, "Failed to update stock " + error.message);
    }
  },

  // Check current stock of a product
  checkStock: async (productId: string) => {
    try {
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId,
        },
      });

      if (!inventory) {
        throw new AppError(404, "No inventory record found for this product");
      }

      return inventory.quantity;
    } catch (error: any) {
      throw new AppError(
        500,
        "Failed to retrieve stock information" + error.message
      );
    }
  },
};
