-- AlterTable
ALTER TABLE "User" ADD COLUMN     "technicianVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TechnicianQuestionnaire" (
    "id" SERIAL NOT NULL,
    "businessName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "experienceYears" INTEGER,
    "experienceAreas" TEXT[],
    "brandsWorkedWith" TEXT[],
    "integrationExperience" TEXT NOT NULL,
    "purchaseSource" TEXT NOT NULL,
    "purchaseHikvision" TEXT NOT NULL,
    "requiresTraining" TEXT NOT NULL,

    CONSTRAINT "TechnicianQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechnicianQuestionnaire_email_key" ON "TechnicianQuestionnaire"("email");
