import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { StkService } from "../services/mpesa/stk.Service";

const prisma = new PrismaClient();

// Run a task every minute
cron.schedule("* * * * *", async () => {
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
        const res = await StkService.queryStk(transaction.checkoutRequestID);
        console.log(`Transaction ${transaction.id} processed successfully.`, res);
      } catch (error) {
        console.error(`Error processing transaction ${transaction.id}:`, error);
        continue; // Skip to the next transaction
      }
    }

    console.log("Cron job executed successfully at", new Date().toISOString());
  } catch (error) {
    console.error("Error running cron job:", error);
  }
});
