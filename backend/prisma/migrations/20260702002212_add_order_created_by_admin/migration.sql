-- AlterTable
ALTER TABLE "LaboratoryOrder" ADD COLUMN     "createdByAdminId" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdByAdminId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaboratoryOrder" ADD CONSTRAINT "LaboratoryOrder_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
