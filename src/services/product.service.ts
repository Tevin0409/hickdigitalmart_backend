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
  getAllProducts: async (searchTerm?: string, categoryId?: string) => {
    try {
      console.log("Search Term:", searchTerm, "Category ID:", categoryId);

      return await prisma.product.findMany({
        where: {
          AND: [
            searchTerm
              ? {
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
                          features: {
                            some: {
                              description: {
                                contains: searchTerm,
                                mode: "insensitive",
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                }
              : {},
            categoryId
              ? {
                  subCategory: {
                    categoryId: { equals: categoryId },
                  },
                }
              : {},
          ],
        },
        include: {
          subCategory: {
            include: { category: true },
          },
          models: {
            include: {
              features: true,
              inventory: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
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
            },
          },
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to fetch product: " + error.message);
    }
  },

  createProduct: async (data: CreateProductDTO) => {
    try {
      return await prisma.product.create({
        data: {
          name: data.name,
          subCategoryId: data.subCategoryId,
          defaultPrice: data.defaultPrice,
          models: {
            create: data.models.map(
              (model: {
                name: string;
                description?: string;
                price: number;
                features: { description: string }[];
                inventory: { quantity: number };
              }) => ({
                name: model.name,
                description: model.description,
                price: model.price,
                features: {
                  create: model.features.map((feature) => ({
                    description: feature.description,
                  })),
                },
                inventory: {
                  create: { quantity: model.inventory.quantity || 0 },
                },
              })
            ),
          },
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to create product: " + error.message);
    }
  },

  updateProduct: async (id: string, data: any) => {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          subCategoryId: data.subCategoryId,
          models: {
            update: data.models.map(
              (model: {
                id: string;
                name: string;
                description?: string;
                price: number;
                features: { id?: string; description: string }[];
                inventory: { quantity: number };
              }) => ({
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
              })
            ),
          },
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to update product: " + error.message);
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

  addStockToProduct: async (modelId: string, quantityToAdd: number) => {
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
        throw new AppError(404, "Inventory not found for this product model");
      }

      return inventory;
    } catch (error: any) {
      throw new AppError(
        500,
        "Failed to add stock to product model: " + error.message
      );
    }
  },
  // Update stock (e.g., decrease stock after a sale)
  updateStock: async (modelId: string, quantityToUpdate: number) => {
    try {
      // Find inventory by modelId (for specific product model)
      const inventory = await prisma.inventory.findFirst({
        where: {
          modelId: modelId, // Use productModelId to find the inventory for the specific model
        },
      });

      if (!inventory) {
        throw new AppError(404, "Inventory not found for this product model");
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
    } catch (error: any) {
      throw new AppError(
        500,
        "Failed to update stock for the product model: " + error.message
      );
    }
  },
  checkStock: async (modelId: string) => {
    try {
      const inventory = await prisma.inventory.findFirst({
        where: {
          modelId: modelId, // Use productModelId to check stock for the specific model
        },
      });

      if (!inventory) {
        throw new AppError(
          404,
          "No inventory record found for this product model"
        );
      }

      return inventory.quantity;
    } catch (error: any) {
      throw new AppError(
        500,
        "Failed to retrieve stock information for the product model: " +
          error.message
      );
    }
  },

  // Wishlist Services
  addToWishlist: async (userId: string, productId: string) => {
    try {
      // Check if the wishlist entry exists
      const existingEntry = await prisma.wishlist.findFirst({
        where: { userId, productId },
      });

      if (existingEntry) {
        // If the entry exists, delete it
        await prisma.wishlist.delete({
          where: { id: existingEntry.id },
        });
        return { message: "Wishlist item removed." };
      } else {
        // If the entry does not exist, add a new one
        await prisma.wishlist.create({
          data: {
            userId,
            productId,
          },
        });
        return { message: "Wishlist item added." };
      }
    } catch (error: any) {
      throw new AppError(500, "Failed to manage wishlist: " + error.message);
    }
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    try {
      return await prisma.wishlist.deleteMany({
        where: {
          userId,
          productId,
        },
      });
    } catch (error: any) {
      throw new AppError(
        500,
        "Failed to remove from wishlist: " + error.message
      );
    }
  },

  getWishlistItems: async (userId: string) => {
    try {
      return await prisma.wishlist.findMany({
        where: { userId },
        include: {
          product: true,
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to fetch wishlist: " + error.message);
    }
  },

  // Cart Services
  addToCart: async (userId: string, productId: string, quantity: number) => {
    try {
      const existingCartItem = await prisma.cart.findFirst({
        where: { userId, productId },
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
          productId,
          quantity,
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to add to cart: " + error.message);
    }
  },

  removeFromCart: async (userId: string, productId: string) => {
    try {
      return await prisma.cart.deleteMany({
        where: {
          userId,
          productId,
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to remove from cart: " + error.message);
    }
  },

  updateCartItem: async (
    userId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      return await prisma.cart.updateMany({
        where: {
          userId,
          productId,
        },
        data: {
          quantity,
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to update cart item: " + error.message);
    }
  },

  getCartItems: async (userId: string) => {
    return await prisma.cart.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  },

  createOrder: async (
    userId: string,
    products: { productModelId: string; quantity: number }[] // Using productModelId instead of modelId
  ) => {
    try {
      // Check stock for each product model
      for (const { productModelId, quantity } of products) {
        const inventory = await prisma.inventory.findFirst({
          where: { modelId: productModelId }, // Using productModelId
        });

        if (!inventory || inventory.quantity < quantity) {
          throw new AppError(
            400,
            `Insufficient stock for product model ID: ${productModelId}` // Updated error message
          );
        }
      }

      // Create the order and update inventory
      return await prisma.$transaction(async (tx) => {
        // Create the order
        const order = await tx.order.create({
          data: {
            userId,
            orderItems: {
              create: products.map(({ productModelId, quantity }) => ({
                productModel: { connect: { id: productModelId } }, // Connecting to ProductModel
                quantity,
              })),
            },
          },
          include: { orderItems: true },
        });

        // Reduce inventory
        for (const { productModelId, quantity } of products) {
          await tx.inventory.updateMany({
            where: { modelId: productModelId }, // Using productModelId
            data: { quantity: { decrement: quantity } },
          });
        }

        return order;
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to create order: " + error.message);
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      return await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
    } catch (error: any) {
      throw new AppError(
        500,
        "Failed to update order status: " + error.message
      );
    }
  },

  getOrders: async (userId?: string) => {
    try {
      return await prisma.order.findMany({
        where: userId ? { userId } : {},
        include: {
          orderItems: {
            include: {
              productModel: true, // Updated to reference ProductModel
            },
          },
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to retrieve orders: " + error.message);
    }
  },
  
  cancelOrder: async (orderId: string, restoreStock = false) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true },
        });
  
        if (!order) {
          throw new AppError(404, "Order not found");
        }
  
        if (restoreStock) {
          for (const { productModelId, quantity } of order.orderItems) { // Changed productId to productModelId
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
    } catch (error: any) {
      throw new AppError(500, "Failed to cancel order: " + error.message);
    }
  },
  
  getOrder: async (orderId: string) => {
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
        throw new AppError(404, "Order not found");
      }
  
      return order;
    } catch (error: any) {
      throw new AppError(500, "Failed to retrieve order: " + error.message);
    }
  },
  
  // Delete an order
  deleteOrder: async (orderId: string) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true },
        });
  
        if (!order) {
          throw new AppError(404, "Order not found");
        }
  
        // Restore stock if needed (when deleting an order)
        for (const { productModelId, quantity } of order.orderItems) { // Changed productId to productModelId
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
    } catch (error: any) {
      throw new AppError(500, "Failed to delete order: " + error.message);
    }
  }
  
};
