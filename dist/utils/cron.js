"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const node_cron_1 = __importDefault(require("node-cron"));
const stk_Service_1 = require("../services/mpesa/stk.Service");
const prisma = new client_1.PrismaClient();
// Run a task every minute
node_cron_1.default.schedule("* * * * *", async () => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                responseDescription: "ResponseDescription",
            },
        });
        if (transactions.length === 0) {
            return;
        }
        for (const transaction of transactions) {
            await stk_Service_1.StkService.queryStk(transaction.checkoutRequestID);
        }
        console.log("Cron job executed successfully:", new Date().toISOString());
    }
    catch (error) {
        console.error("Error running cron job:", error);
    }
});
console.log("Cron job scheduled.");
