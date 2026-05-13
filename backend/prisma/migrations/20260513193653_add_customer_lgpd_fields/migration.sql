-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "lgpdAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "lgpdConsentSource" TEXT;
