-- CreateTable
CREATE TABLE "CustomerAttendance" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdByAdminId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAttendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerAttendance" ADD CONSTRAINT "CustomerAttendance_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAttendance" ADD CONSTRAINT "CustomerAttendance_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
