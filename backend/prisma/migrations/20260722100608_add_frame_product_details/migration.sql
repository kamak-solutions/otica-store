-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "costPrice" DECIMAL(10,2),
ADD COLUMN     "minimumStock" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCollection" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrameDetails" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "collectionId" TEXT,
    "supplierCode" TEXT,
    "internalCode" TEXT NOT NULL,
    "modelCode" TEXT NOT NULL,
    "publicBrand" TEXT NOT NULL DEFAULT 'Ótica Show Room',
    "audience" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT,
    "finish" TEXT,
    "lensWidth" INTEGER,
    "bridgeWidth" INTEGER,
    "templeLength" INTEGER,
    "sizeLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrameDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCollection_code_key" ON "ProductCollection"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FrameDetails_productId_key" ON "FrameDetails"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "FrameDetails_internalCode_key" ON "FrameDetails"("internalCode");

-- CreateIndex
CREATE INDEX "FrameDetails_supplierId_idx" ON "FrameDetails"("supplierId");

-- CreateIndex
CREATE INDEX "FrameDetails_collectionId_idx" ON "FrameDetails"("collectionId");

-- CreateIndex
CREATE INDEX "FrameDetails_audience_idx" ON "FrameDetails"("audience");

-- CreateIndex
CREATE INDEX "FrameDetails_material_idx" ON "FrameDetails"("material");

-- CreateIndex
CREATE INDEX "FrameDetails_shape_idx" ON "FrameDetails"("shape");

-- CreateIndex
CREATE INDEX "FrameDetails_primaryColor_idx" ON "FrameDetails"("primaryColor");

-- AddForeignKey
ALTER TABLE "FrameDetails" ADD CONSTRAINT "FrameDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameDetails" ADD CONSTRAINT "FrameDetails_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameDetails" ADD CONSTRAINT "FrameDetails_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ProductCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
