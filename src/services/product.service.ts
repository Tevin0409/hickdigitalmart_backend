import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "../middleware";
import {
  CreateProductDTO,
  UpdateProductDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from "../interface/product";
import { UploadedFile } from "express-fileupload";
import { uploadImages } from "../config/claudinary.config";
import { stat } from "fs";

const prisma = new PrismaClient();

export const productService = {
  // Product Services
  getAllProducts: async (
    searchTerm?: string,
    categoryIds?: string[],
    subCategoryIds?: string[],
    featureIds?: string[],
    minPrice?: number,
    maxPrice?: number,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const conditions: any[] = [];

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
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  getAllProductsModels: async (
    searchTerm?: string,
    categoryIds?: string[],
    subCategoryIds?: string[],
    featureIds?: string[],
    minPrice?: number,
    maxPrice?: number,
    page: number = 1,
    limit: number = 10,
    roleId?: string
  ) => {
    try {
      const conditions: Prisma.ProductModelWhereInput[] = [];
      conditions.push({ status: "visible" });

      if (searchTerm) {
        conditions.push({
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            {
              product: { name: { contains: searchTerm, mode: "insensitive" } },
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

      if (categoryIds?.length) {
        conditions.push({
          product: {
            subCategory: {
              categoryId: { in: categoryIds },
            },
          },
        });
      }

      if (subCategoryIds?.length) {
        conditions.push({
          product: {
            subCategoryId: { in: subCategoryIds },
          },
        });
      }

      if (featureIds?.length) {
        conditions.push({
          features: {
            some: {
              id: { in: featureIds },
            },
          },
        });
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        conditions.push({
          price: {
            gte: minPrice ?? 0,
            lte: maxPrice ?? Number.MAX_SAFE_INTEGER,
          },
        });
      }

      const whereCondition = conditions.length ? { AND: conditions } : {};

      const totalResults = await prisma.productModel.count({
        where: whereCondition,
      });
      const totalPages = Math.ceil(totalResults / limit);

      const now = new Date();

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
              role: { select: { name: true, id: true } },
            },
          },
          Review: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: { select: { name: true } },
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
                      role: { select: { name: true } },
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

      const results = await Promise.all(
        models.map(async (model) => {
          const originalPrice = model.price;
          let roleAdjustedPrice = originalPrice;
          let discountedPrice: number | null = null;

          // Apply role-based percentage if roleId provided
          if (roleId) {
            const rolePercentage = model.PricePercentage.find(
              (p) => p.roleId === roleId
            );
            if (rolePercentage) {
              roleAdjustedPrice =
                originalPrice * (rolePercentage.percentage / 100);
            }
          }

          // Check for active scheduled price change
          let activeChange = await prisma.scheduledPriceChange.findFirst({
            where: {
              productModelId: model.id,
              startsAt: { lte: now },
              endsAt: { gte: now },
            },
          });

          if (!activeChange) {
            activeChange = await prisma.scheduledPriceChange.findFirst({
              where: {
                subCategoryId: model.product.subCategoryId,
                startsAt: { lte: now },
                endsAt: { gte: now },
              },
            });
          }

          if (activeChange) {
            discountedPrice =
              roleAdjustedPrice * (activeChange.percentage / 100);
          }

          return {
            ...model,
            originalPrice,
            roleAdjustedPrice,
            discountedPrice,
          };
        })
      );

      return {
        page,
        limit,
        totalPages,
        totalResults,
        results,
      };
    } catch (error) {
      console.error("Error fetching product models:", error);
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
    } catch (error: any) {
      throw new AppError(500, "Failed to fetch product: " + error.message);
    }
  },
  getProductModelById: async (id: string) => {
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
    } catch (error: any) {
      throw new AppError(
        500,
        "Failed to fetch product model : " + error.message
      );
    }
  },
  getFeature: async (
    categoryId?: string,
    productId?: string,
    productModelId?: string
  ) => {
    const conditions: any[] = [];

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

  createProduct: async (data: CreateProductDTO) => {
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
        throw new AppError(400, `${existingProductModel.name} already exists`);
      }
      return await prisma.product.create({
        data: {
          name: data.name,
          subCategoryId: data.subCategoryId,
          models: {
            create: data.models.map(
              (model: {
                name: string;
                description?: string;
                price: number;
                features: { description: string }[];
                inventory: { quantity: number };
                minimumStock: number;
              }) => ({
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
  updateProductModel: async (id: string, data: any) => {
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
                  update: data.features.map(
                    (feature: { id: string; description: string }) => ({
                      where: { id: feature.id },
                      data: { description: feature.description },
                    })
                  ),
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
    } catch (error: any) {
      throw new AppError(500, `Failed to update product: ${error.message}`);
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

  getSubCategorryByName: async (name: string) => {
    try {
      return await prisma.subCategory.findFirst({ where: { name } });
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
  addToWishlist: async (userId: string, productModelId: string) => {
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
      } else {
        // If the entry does not exist, add a new one
        await prisma.wishlist.create({
          data: {
            userId,
            productModelId,
          },
        });
        return { message: "Wishlist item added." };
      }
    } catch (error: any) {
      throw new AppError(500, "Failed to manage wishlist: " + error.message);
    }
  },

  removeFromWishlist: async (userId: string, wishlistId: string) => {
    try {
      return await prisma.wishlist.delete({
        where: {
          userId,
          id: wishlistId,
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
          productModel: {
            include: {
              images: true,
              features: true,
            },
          },
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to fetch wishlist: " + error.message);
    }
  },

  // Cart Services
  addToCart: async (
    userId: string,
    productModelId: string,
    quantity: number
  ) => {
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
    } catch (error: any) {
      throw new AppError(500, "Failed to add to cart: " + error.message);
    }
  },

  removeFromCart: async (userId: string, cartId: string) => {
    try {
      return await prisma.cart.delete({
        where: {
          userId,
          id: cartId,
        },
      });
    } catch (error: any) {
      throw new AppError(500, "Failed to remove from cart: " + error.message);
    }
  },

  updateCartItem: async (
    userId: string,
    productModelId: string,
    quantity: number
  ) => {
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
    } catch (error: any) {
      throw new AppError(500, "Failed to update cart item: " + error.message);
    }
  },

  getCartItems: async (userId: string) => {
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

  createOrder: async (
    userId: string,
    orderData: {
      first_name: string;
      last_name: string;
      company_name?: string;
      street_address: string;
      apartment?: string;
      town: string;
      phone_number: string;
      email: string;
      products: { productModelId: string; quantity: number }[];
      isVat: boolean;
    }
  ) => {
    try {
      let orderPrice = 0;
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
      } = orderData;

      // Check stock and calculate order price
      for (const { productModelId, quantity } of products) {
        const inventory = await prisma.inventory.findUnique({
          where: { modelId: productModelId },
          include: { model: true },
        });

        if (!inventory || inventory.quantity < quantity) {
          throw new AppError(
            400,
            `Insufficient stock for product model ID: ${productModelId}`
          );
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
    } catch (error: any) {
      throw new AppError(500, "Failed to retrieve orders: " + error.message);
    }
  },
  getAllOrders: async (
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    status?: string
  ) => {
    try {
      const skip = (page - 1) * limit;

      // Construct search filters
      const filters: any = {};

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
  getOrderByEmail: async (email: string) => {
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
        throw new AppError(404, "Order not found");
      }

      return orders;
    } catch (error: any) {
      throw new AppError(500, "Failed to retrieve orders: " + error.message);
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
    } catch (error: any) {
      throw new AppError(500, "Failed to delete order: " + error.message);
    }
  },
  uploadFile: async (files: UploadedFile | UploadedFile[]) => {
    const filesArray = Array.isArray(files) ? files : [files];

    const imageUrls: string[] = [];
    const publicIds: string[] = [];

    // Process each file
    filesArray.forEach((file, index) => {
      imageUrls.push(file.tempFilePath);
      publicIds.push(`products`);
    });

    const uploadResults = await uploadImages(imageUrls, publicIds);

    return uploadResults;
  },
  addProductImages: async (
    filesData: Record<string, UploadedFile | UploadedFile[]>
  ) => {
    try {
      if (!filesData || Object.keys(filesData).length === 0) {
        throw new Error("No files uploaded");
      }

      const savedImages: any[] = [];

      // Loop through each productModelId dynamically
      for (const productModelId of Object.keys(filesData)) {
        const filesArray = Array.isArray(filesData[productModelId])
          ? filesData[productModelId]
          : [filesData[productModelId]];

        // Extract file paths for Cloudinary upload
        const imageUrls = filesArray.map((file) => file.tempFilePath); // Express-fileupload uses tempFilePath
        const publicIds = filesArray.map(() => `products`);

        // Upload images to Cloudinary
        const uploadResults = await uploadImages(imageUrls, publicIds);

        // Check if there's already a primary image for this productModelId
        const existingPrimaryImageCount = await prisma.productImage.count({
          where: {
            productModelId,
            isPrimary: true,
          },
        });

        // Set `isPrimary` for the first image if no primary image exists, otherwise set all to false
        const images = await Promise.all(
          uploadResults.map(async (upload, index) => {
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
          })
        );

        savedImages.push(...images);
      }

      return { message: "Images uploaded successfully", images: savedImages };
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while uploading images."
      );
    }
  },
  setPrimaryImage: async (imageId: string, productModelId: string) => {
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
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while setting the primary image."
      );
    }
  },

  removeImage: async (imageId: string) => {
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
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while removing the image."
      );
    }
  },
  addReview: async (
    userId: string,
    productModelId: string,
    rating: number,
    comment: string,
    images: {
      uploadUrl: string;
      optimizeUrl?: string;
      autoCropUrl?: string; // ignored in schema, unless you want to add it
      isPrimary?: boolean;
    }[]
  ) => {
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
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while adding the review."
      );
    }
  },
  getReviews: async (productModelId: string) => {
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
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while fetching the reviews."
      );
    }
  },
  respondToReview: async (
    reviewId: string,
    message: string,
    userId: string
  ) => {
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
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while responding to the review."
      );
    }
  },
  getPricePercentages: async () => {
    try {
      return await prisma.pricePercentage.findMany({
        include: { role: { select: { name: true } } },
      });
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while fetching price percentages."
      );
    }
  },
  createPricePercentage: async (
    data: { roleId: string; productModelId: string; percentage: number }[]
  ) => {
    try {
      const pricePercentages = await prisma.pricePercentage.createMany({
        data,
        skipDuplicates: true, // optional
      });
      return pricePercentages;
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while creating price percentages."
      );
    }
  },
  updatePricePercentage: async (
    percentagePriceId: string,
    percentage: number
  ) => {
    try {
      const updated = await prisma.pricePercentage.update({
        where: { id: percentagePriceId },
        data: {
          percentage,
          updatedAt: new Date(),
        },
      });

      return updated;
    } catch (error: any) {
      throw new Error(
        error.message ||
          "An error occurred while updating the price percentage."
      );
    }
  },
  moveProductToLive: async (modelId: string) => {
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
      const hasSufficientInventory =
        productModel.inventory &&
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
        throw new Error(
          "Inventory must be greater than or equal to minimum stock."
        );
      }

      // Update status to "VISIBLE"
      const updatedModel = await prisma.productModel.update({
        where: { id: modelId },
        data: {
          status: "visible",
        },
      });

      return updatedModel;
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while publishing the product model."
      );
    }
  },
  updateFeatureList: async (modelId: string): Promise<any> => {
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
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while updating the feature list."
      );
    }
  },
  schedulePriceChange: async (
    modelId?: string,
    subCategoryId?: string,
    percentage?: number,
    startDate?: Date,
    endDate?: Date,
    reason?: string
  ) => {
    try {
      // Ensure exactly one target is provided
      if ((modelId && subCategoryId) || (!modelId && !subCategoryId)) {
        throw new Error(
          "Provide either modelId or subCategoryId, but not both."
        );
      }

      if (
        percentage === undefined ||
        startDate === undefined ||
        endDate === undefined
      ) {
        throw new Error(
          "Percentage, startDate, and endDate are required for scheduling."
        );
      }

      const data: any = {
        percentage,
        startsAt: startDate,
        endsAt: endDate,
        reason,
      };

      if (modelId) {
        data.productModelId = modelId;
      } else if (subCategoryId) {
        data.subCategoryId = subCategoryId;
      }

      const scheduledChange = await prisma.scheduledPriceChange.create({
        data,
      });

      return scheduledChange;
    } catch (error: any) {
      throw new Error(
        error.message || "An error occurred while scheduling the price change."
      );
    }
  },
  updateScheduledPriceChange: async (
    priceChangeId: string,
    modelId?: string,
    subCategoryId?: string,
    percentage?: number,
    startDate?: Date,
    endDate?: Date,
    reason?: string
  ) => {
    try {
      // Ensure only one of modelId or subCategoryId is provided
      if ((modelId && subCategoryId) || (!modelId && !subCategoryId)) {
        throw new Error(
          "Provide either modelId or subCategoryId, but not both."
        );
      }

      const updateData: any = {};

      if (modelId) {
        updateData.productModelId = modelId;
        updateData.subCategoryId = null; // Clear other if switching
      } else if (subCategoryId) {
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
    } catch (error: any) {
      throw new Error(
        error.message ||
          "An error occurred while updating the scheduled price change."
      );
    }
  },
  getScheduledPriceChanges: async (filters?: {
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
  }) => {
    try {
      const { startDate, endDate, isActive } = filters || {};

      const whereClause: any = {};

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
        } else {
          whereClause.OR = [{ startsAt: { gt: now } }, { endsAt: { lt: now } }];
        }
      }

      const scheduledChanges = await prisma.scheduledPriceChange.findMany({
        where: whereClause,
        orderBy: {
          startsAt: "asc",
        },
        include: {
          productModel: true,
          subCategory: true,
        },
      });

      return scheduledChanges;
    } catch (error: any) {
      throw new Error(
        error.message ||
          "An error occurred while fetching scheduled price changes."
      );
    }
  },
};
