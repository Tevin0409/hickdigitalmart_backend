/*
  Warnings:

  - The `purchaseSource` column on the `TechnicianQuestionnaire` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TechnicianQuestionnaire" ADD COLUMN     "familiarWithStandard" TEXT,
DROP COLUMN "purchaseSource",
ADD COLUMN     "purchaseSource" TEXT[],
ALTER COLUMN "requiresTraining" DROP NOT NULL;
