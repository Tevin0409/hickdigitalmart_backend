import { PrismaClient } from "@prisma/client";

interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
}

const prisma = new PrismaClient();

const getDashboardSummary = async ({
  startDate,
  endDate,
}: DashboardFilters) => {
  const dateFilter =
    startDate && endDate ? { createdAt: { gte: startDate, lte: endDate } } : {};

  // 1. Total Revenue in Ksh
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: dateFilter,
  });

  // 2. Total Orders
  const totalOrders = await prisma.order.count({ where: dateFilter });

  // 3. Top 5 Customers by Spending
  const topCustomers = await prisma.order.groupBy({
    by: ["userId"],
    _sum: { total: true },
    where: dateFilter,
    orderBy: { _sum: { total: "desc" } },
    take: 5,
  });

  // Fetch customer details and map spending
  const topCustomerInfo = await prisma.user.findMany({
    where: {
      id: {
        in: topCustomers.map((customer) => customer.userId),
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  const topCustomersData = topCustomers.map((customer) => {
    const user = topCustomerInfo.find((u) => u.id === customer.userId);
    return {
      customerId: customer.userId,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      totalSpent: customer._sum.total,
    };
  });

  // 4. Top 5 Selling Models with Quantity Ordered
  const topModels = await prisma.orderItem.groupBy({
    by: ["productModelId"],
    _sum: { quantity: true },
    where: { order: { createdAt: dateFilter?.createdAt } },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  // Fetch product model names
  const topModelInfo = await prisma.productModel.findMany({
    where: {
      id: {
        in: topModels.map((model) => model.productModelId),
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const topModelsData = topModels.map((model) => {
    const product = topModelInfo.find((p) => p.id === model.productModelId);
    return {
      modelId: model.productModelId,
      name: product?.name,
      quantityOrdered: model._sum.quantity,
    };
  });

  return {
    revenueKsh: totalRevenue._sum.total || 0,
    totalOrders,
    topCustomers: topCustomersData,
    topModels: topModelsData,
  };
};

export default { getDashboardSummary };
