/*
  Warnings:

  - A unique constraint covering the columns `[source_hash]` on the table `translations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `source_hash` to the `translations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_language` to the `translations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "translations" ADD COLUMN     "source_hash" VARCHAR(64) NOT NULL,
ADD COLUMN     "source_language" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "translations_source_hash_key" ON "translations"("source_hash");
