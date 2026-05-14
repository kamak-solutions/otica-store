-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentProviderId" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "paymentUrl" TEXT,
ADD COLUMN     "shippingMethod" TEXT,
ADD COLUMN     "shippingPrice" DECIMAL(10,2),
ADD COLUMN     "shippingStatus" TEXT DEFAULT 'not_required';
