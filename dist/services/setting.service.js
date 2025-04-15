"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = void 0;
// services/settingsService.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.settingsService = {
    addBanner: async (data) => {
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
    getBannerById: async (id) => {
        return prisma.banner.findUnique({
            where: { id },
        });
    },
    updateBanner: async (id, data) => {
        return prisma.banner.update({
            where: { id },
            data,
        });
    },
    deleteBanner: async (id) => {
        return prisma.banner.delete({
            where: { id },
        });
    },
};
