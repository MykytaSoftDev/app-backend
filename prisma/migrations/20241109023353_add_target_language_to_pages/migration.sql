/*
  Warnings:

  - Added the required column `target_language` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "target_language" TEXT NOT NULL;
