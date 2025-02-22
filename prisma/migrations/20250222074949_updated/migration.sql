/*
  Warnings:

  - Added the required column `email` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `town` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "apartment" TEXT,
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "street_address" TEXT NOT NULL,
ADD COLUMN     "town" TEXT NOT NULL;
