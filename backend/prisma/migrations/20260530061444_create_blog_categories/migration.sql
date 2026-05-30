-- AlterTable
ALTER TABLE "BlogCategory" ADD COLUMN     "description" TEXT,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;
