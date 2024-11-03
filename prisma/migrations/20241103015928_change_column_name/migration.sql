/*
  Warnings:

  - You are about to drop the column `targetLanguage` on the `translations` table. All the data in the column will be lost.
  - Added the required column `target_language` to the `translations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "translations_page_id_targetLanguage_idx";

-- AlterTable
ALTER TABLE "translations" DROP COLUMN "targetLanguage",
ADD COLUMN     "target_language" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "translations_page_id_target_language_idx" ON "translations"("page_id", "target_language");
