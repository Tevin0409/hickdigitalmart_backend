import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const reportService = {
  // ✅ User registrations grouped by month & role
  userRegistrations: async (startDate?: string, endDate?: string) => {
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: {
        createdAt: true,
        role: {
          select: { name: true },
        },
      },
    });

    return users.reduce((acc: any, user) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        user.createdAt
      );
      const roleName = user.role?.name || "Unknown";

      if (!acc[month]) acc[month] = {};
      acc[month][roleName] = (acc[month][roleName] || 0) + 1;

      return acc;
    }, {});
  },

  // ✅ Verified users grouped by month
  verifiedUsers: async (startDate?: string, endDate?: string) => {
    const users = await prisma.user.findMany({
      where: {
        isVerified: true,
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: { createdAt: true },
    });

    return users.reduce((acc: any, user) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        user.createdAt
      );
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  },

  // ✅ Sales summary grouped by month
  salesSummary: async (startDate?: string, endDate?: string) => {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: {
        createdAt: true,
        orderPrice: true,
        vat: true,
        total: true,
      },
    });

    return orders.reduce((acc: any, order) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        order.createdAt
      );
      if (!acc[month]) acc[month] = { totalSales: 0, vat: 0, totalOrders: 0 };
      acc[month].totalSales += order.orderPrice;
      acc[month].vat += order.vat;
      acc[month].totalOrders += 1;
      return acc;
    }, {});
  },

  // ✅ Orders grouped by status
  orderStatus: async (startDate?: string, endDate?: string) => {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: { status: true },
    });

    return orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  },

  // ✅ Top products based on sales grouped by month
  topProducts: async (startDate?: string, endDate?: string) => {
    const products = await prisma.orderItem.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: {
        createdAt: true,
        quantity: true,
        productModel: {
          // ✅ Fetch the product model name
          select: { name: true },
        },
      },
    });

    return products.reduce((acc: any, product) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        product.createdAt
      );
      const modelName = product.productModel?.name || "Unknown"; // Handle missing names

      if (!acc[month]) acc[month] = {};
      acc[month][modelName] = (acc[month][modelName] || 0) + product.quantity;

      return acc;
    }, {});
  },

  // ✅ Cart abandonment rate
  cartAbandonment: async () => {
    const totalCarts = await prisma.cart.count();
    const totalOrders = await prisma.order.count();
    return {
      abandonedCarts: totalCarts - totalOrders,
      abandonmentRate: ((totalCarts - totalOrders) / totalCarts) * 100,
    };
  },

  // ✅ Low stock products
  lowStock: async (qty = 10) => {
    return await prisma.inventory.findMany({
      where: { quantity: { lt: qty } },
      include: { model: true },
    });
  },

  // ✅ Transaction success rate grouped by month
  transactionSuccessRate: async (startDate?: string, endDate?: string) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: { resultCode: true, createdAt: true },
    });

    const formattedData = transactions.reduce((acc: any, transaction) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        new Date(transaction.createdAt)
      );

      if (!acc[month]) acc[month] = { successful: 0, failed: 0, total: 0 };

      if (transaction.resultCode === 0) {
        acc[month].successful += 1;
      } else {
        acc[month].failed += 1;
      }

      acc[month].total += 1;

      return acc;
    }, {});

    // Compute success & failure rates
    Object.keys(formattedData).forEach((month) => {
      const data = formattedData[month];
      data.successRate =
        ((data.successful / data.total) * 100).toFixed(2) + "%";
      data.failureRate = ((data.failed / data.total) * 100).toFixed(2) + "%";
    });

    return formattedData;
  },

  // ✅ Customer orders grouped by month
  customerOrders: async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: { userId },
      select: { createdAt: true, orderItems: true },
    });

    return orders.reduce((acc: any, order) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        order.createdAt
      );
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  },

  // ✅ Wishlist trends grouped by month
  wishlistTrends: async (startDate?: string, endDate?: string) => {
    const wishlists = await prisma.wishlist.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: {
        createdAt: true,
        productModel: {
          // ✅ Get product model name
          select: { name: true },
        },
      },
    });

    return wishlists.reduce((acc: any, wishlist) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        wishlist.createdAt
      );
      const modelName = wishlist.productModel?.name || "Unknown"; // Handle missing names

      if (!acc[month]) acc[month] = {};
      acc[month][modelName] = (acc[month][modelName] || 0) + 1;

      return acc;
    }, {});
  },

  // ✅ Technician registrations grouped by month
  technicianRegistrations: async (startDate?: string, endDate?: string) => {
    const technicians = await prisma.technicianQuestionnaire.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate ?? "2025-01-01"),
          lte: new Date(endDate ?? new Date()),
        },
      },
      select: { createdAt: true },
    });

    return technicians.reduce((acc: any, technician) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        technician.createdAt
      );
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  },
};
