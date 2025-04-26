/*
  Warnings:

  - You are about to drop the column `target_language` on the `glossary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "glossary" DROP COLUMN "target_language",
ADD COLUMN     "target_languages" TEXT[] DEFAULT ARRAY[]::TEXT[];
