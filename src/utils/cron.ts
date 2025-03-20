import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { StkService } from "../services/mpesa/stk.Service";

const prisma = new PrismaClient();

// Run a task every minute
cron.schedule("* * * * *", async () => {
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
            await StkService.queryStk(transaction.checkoutRequestID);
        }

        console.log("Cron job executed successfully:", new Date().toISOString());
    } catch (error) {
        console.error("Error running cron job:", error);
    }
});

console.log("Cron job scheduled.");
