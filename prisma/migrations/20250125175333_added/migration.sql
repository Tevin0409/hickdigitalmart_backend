-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productModelId" TEXT NOT NULL,
    "uploadUrl" VARCHAR(255) NOT NULL,
    "optimizeUrl" VARCHAR(255),
    "autoCropUrl" VARCHAR(255),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_productModelId_isPrimary_key" ON "ProductImage"("productModelId", "isPrimary");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productModelId_fkey" FOREIGN KEY ("productModelId") REFERENCES "ProductModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
