-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "attendanceId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "CustomerAttendance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
