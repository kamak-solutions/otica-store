-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "location" DROP DEFAULT;
