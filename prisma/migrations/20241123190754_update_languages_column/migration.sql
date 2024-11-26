/*
  Warnings:

  - You are about to drop the column `code3` on the `languages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[flag]` on the table `languages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "languages_code3_key";

-- AlterTable
ALTER TABLE "languages" DROP COLUMN "code3",
ADD COLUMN     "flag" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "languages_flag_key" ON "languages"("flag");
