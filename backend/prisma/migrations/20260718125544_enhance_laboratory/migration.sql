-- AlterTable
ALTER TABLE "Laboratory" ADD COLUMN     "acceptsApi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "averageDeliveryDays" INTEGER,
ADD COLUMN     "contactName" TEXT;
