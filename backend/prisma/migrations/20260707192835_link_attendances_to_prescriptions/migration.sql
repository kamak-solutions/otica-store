-- AlterTable
ALTER TABLE "CustomerAttendance" ADD COLUMN     "prescriptionId" TEXT;

-- AddForeignKey
ALTER TABLE "CustomerAttendance" ADD CONSTRAINT "CustomerAttendance_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "OpticalPrescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
