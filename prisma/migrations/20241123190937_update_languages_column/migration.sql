/*
  Warnings:

  - A unique constraint covering the columns `[code3]` on the table `languages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code3` to the `languages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "languages" ADD COLUMN     "code3" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "languages_code3_key" ON "languages"("code3");
