/*
  Warnings:

  - Added the required column `type` to the `CustomerReminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerReminder" ADD COLUMN     "type" TEXT NOT NULL;
