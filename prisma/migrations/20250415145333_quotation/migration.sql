-- CreateTable
CREATE TABLE "QuotationRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationRequestItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "productModelId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuotationRequestItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuotationRequest" ADD CONSTRAINT "QuotationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRequestItem" ADD CONSTRAINT "QuotationRequestItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "QuotationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRequestItem" ADD CONSTRAINT "QuotationRequestItem_productModelId_fkey" FOREIGN KEY ("productModelId") REFERENCES "ProductModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
