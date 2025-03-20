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
        console.log("Starting cron job...");
        const transactions = await prisma.transaction.findMany({
            where: {
                responseDescription: "Success. Request accepted for processing",
            },
        });
        console.log(`Found ${transactions.length} transactions to process.`);
        if (transactions.length === 0) {
            return;
        }
        for (const transaction of transactions) {
            try {
                const res = await stk_Service_1.StkService.queryStk(transaction.checkoutRequestID);
                console.log(`Transaction ${transaction.id} processed successfully.`, res);
            }
            catch (error) {
                console.error(`Error processing transaction ${transaction.id}:`, error);
                continue; // Skip to the next transaction
            }
        }
        console.log("Cron job executed successfully at", new Date().toISOString());
    }
    catch (error) {
        console.error("Error running cron job:", error);
    }
});
