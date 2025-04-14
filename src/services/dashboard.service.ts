import { PrismaClient } from "@prisma/client";

interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
}

const prisma = new PrismaClient();

export const dashboardService = {
  getDashboardSummary: async ({ startDate, endDate }: DashboardFilters) => {
    const dateFilter =
      startDate && endDate
        ? {
            createdAt: { gte: startDate, lte: endDate },
          }
        : {};

    // 1. Total Revenue
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: dateFilter,
    });

    // 2. Total Orders
    const totalOrders = await prisma.order.count({ where: dateFilter });

    // 3. Top Customers
    const topCustomers = await prisma.order.groupBy({
      by: ["userId"],
      _sum: { total: true },
      where: dateFilter,
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    });

    const topCustomerInfo = await prisma.user.findMany({
      where: {
        id: { in: topCustomers.map((c) => c.userId) },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    const topCustomersData = topCustomers.map((c) => {
      const user = topCustomerInfo.find((u) => u.id === c.userId);
      return {
        customerId: c.userId,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        totalSpent: c._sum.total,
      };
    });

    // 4. Top Selling Models
    const topModels = await prisma.orderItem.groupBy({
      by: ["productModelId"],
      _sum: { quantity: true },
      where: {
        order: {
          createdAt: dateFilter?.createdAt,
        },
      },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topModelInfo = await prisma.productModel.findMany({
      where: {
        id: { in: topModels.map((m) => m.productModelId) },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const topModelsData = topModels.map((m) => {
      const model = topModelInfo.find((p) => p.id === m.productModelId);
      return {
        modelId: m.productModelId,
        name: model?.name,
        quantityOrdered: m._sum.quantity,
      };
    });

    // 5. Sales per Duration
    const orders = await prisma.order.findMany({
      where: dateFilter,
      select: {
        createdAt: true,
        total: true,
      },
    });

    const salesPerDuration = {
      weekly: {} as Record<string, number>,
      monthly: {} as Record<string, number>,
      yearly: {} as Record<string, number>,
    };

    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const week = `${d.getFullYear()}-W${Math.ceil(
        (d.getDate() + 6 - d.getDay()) / 7
      )}`;
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const year = `${d.getFullYear()}`;

      salesPerDuration.weekly[week] =
        (salesPerDuration.weekly[week] || 0) + order.total;
      salesPerDuration.monthly[month] =
        (salesPerDuration.monthly[month] || 0) + order.total;
      salesPerDuration.yearly[year] =
        (salesPerDuration.yearly[year] || 0) + order.total;
    });

    // 6. Sales per Category
    const categorySalesRaw = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: dateFilter?.createdAt,
        },
      },
      select: {
        quantity: true,
        productModel: {
          select: {
            product: {
              select: {
                subCategory: {
                  select: {
                    category: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const salesByCategory: Record<string, number> = {};
    categorySalesRaw.forEach((item) => {
      const category = item.productModel.product.subCategory.category.name;
      salesByCategory[category] =
        (salesByCategory[category] || 0) + item.quantity;
    });

    // 7. Inventory Value
    const inventory = await prisma.productModel.findMany({
      select: {
        price: true,
        inventory: {
          select: { quantity: true },
        },
      },
    });

    const inventoryValue = inventory.reduce((sum, item) => {
      const quantity = item.inventory?.quantity || 0;
      return sum + item.price * quantity;
    }, 0);

    return {
      revenueKsh: totalRevenue._sum.total || 0,
      totalOrders,
      topCustomers: topCustomersData,
      topModels: topModelsData,
      salesPerDuration,
      salesByCategory,
      inventoryValue,
    };
  },
};
