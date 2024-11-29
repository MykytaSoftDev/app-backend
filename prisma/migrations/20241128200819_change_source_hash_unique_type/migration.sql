/*
  Warnings:

  - A unique constraint covering the columns `[source_hash,project_id]` on the table `translations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "translations_source_hash_key";

-- CreateIndex
CREATE UNIQUE INDEX "translations_source_hash_project_id_key" ON "translations"("source_hash", "project_id");
