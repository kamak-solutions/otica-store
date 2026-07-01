-- CreateTable
CREATE TABLE "Laboratory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "website" TEXT,
    "city" TEXT,
    "state" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Laboratory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpticalPrescription" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "examDate" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "rightSpherical" TEXT,
    "rightCylindrical" TEXT,
    "rightAxis" TEXT,
    "leftSpherical" TEXT,
    "leftCylindrical" TEXT,
    "leftAxis" TEXT,
    "addition" TEXT,
    "pupillaryDistance" TEXT,
    "height" TEXT,
    "doctorName" TEXT,
    "doctorCrm" TEXT,
    "notes" TEXT,
    "fileUrl" TEXT,
    "filePublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpticalPrescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaboratoryOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "laboratoryId" TEXT NOT NULL,
    "prescriptionId" TEXT,
    "externalOrderNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "expectedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaboratoryOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OpticalPrescription" ADD CONSTRAINT "OpticalPrescription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaboratoryOrder" ADD CONSTRAINT "LaboratoryOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaboratoryOrder" ADD CONSTRAINT "LaboratoryOrder_laboratoryId_fkey" FOREIGN KEY ("laboratoryId") REFERENCES "Laboratory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaboratoryOrder" ADD CONSTRAINT "LaboratoryOrder_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "OpticalPrescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
