/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Laboratory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Laboratory" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Laboratory_code_key" ON "Laboratory"("code");
