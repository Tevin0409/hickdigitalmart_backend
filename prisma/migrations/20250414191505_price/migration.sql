/*
  Warnings:

  - You are about to drop the column `productId` on the `PricePercentage` table. All the data in the column will be lost.
  - Added the required column `productModelId` to the `PricePercentage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PricePercentage" DROP CONSTRAINT "PricePercentage_productId_fkey";

-- AlterTable
ALTER TABLE "PricePercentage" DROP COLUMN "productId",
ADD COLUMN     "productModelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PricePercentage" ADD CONSTRAINT "PricePercentage_productModelId_fkey" FOREIGN KEY ("productModelId") REFERENCES "ProductModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
