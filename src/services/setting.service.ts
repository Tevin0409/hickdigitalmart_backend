// services/settingsService.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const settingsService = {
  addBanner: async (data: any) => {
    return prisma.banner.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        mobileImageUrl: data.mobileImageUrl,
        linkUrl: data.linkUrl,
        isVisibleWeb: data.isVisibleWeb,
        isVisibleMobile: data.isVisibleMobile,
        priority: data.priority,
        status: data.status,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      },
    });
  },

  getAllBanners: async () => {
    return prisma.banner.findMany({
      orderBy: { priority: 'desc' },
    });
  },

  getBannerById: async (id: string) => {
    return prisma.banner.findUnique({
      where: { id },
    });
  },

  updateBanner: async (id: string, data: any) => {
    return prisma.banner.update({
      where: { id },
      data,
    });
  },

  deleteBanner: async (id: string) => {
    return prisma.banner.delete({
      where: { id },
    });
  },
};
