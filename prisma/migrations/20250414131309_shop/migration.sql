-- CreateTable
CREATE TABLE "ShopOwnerQuestionnaire" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "phoneNumber2" TEXT,
    "email" TEXT NOT NULL,
    "email2" TEXT,
    "address" TEXT NOT NULL,
    "selectedBusinessType" TEXT NOT NULL,
    "selectedBrands" TEXT[],
    "selectedSecurityBrands" TEXT[],
    "otherBrand" TEXT,
    "selectedCategories" TEXT[],
    "hikvisionChallenges" TEXT,
    "adviceToSecureDigital" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopOwnerQuestionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopOwnerQuestionnaire_email_key" ON "ShopOwnerQuestionnaire"("email");
