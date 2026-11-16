-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "packageHeightCm" DECIMAL(8,2),
ADD COLUMN     "packageLengthCm" DECIMAL(8,2),
ADD COLUMN     "packageWidthCm" DECIMAL(8,2),
ADD COLUMN     "weightGrams" INTEGER;
