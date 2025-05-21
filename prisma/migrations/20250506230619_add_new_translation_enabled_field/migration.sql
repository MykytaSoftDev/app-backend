/*
  Warnings:

  - You are about to drop the column `createdAt` on the `page_exclusions` table. All the data in the column will be lost.
  - You are about to drop the column `matchType` on the `page_exclusions` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `page_exclusions` table. All the data in the column will be lost.
  - You are about to drop the `selector_exclusions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `project_id` to the `page_exclusions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rule` to the `page_exclusions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "page_exclusions" DROP CONSTRAINT "page_exclusions_projectId_fkey";

-- DropForeignKey
ALTER TABLE "selector_exclusions" DROP CONSTRAINT "selector_exclusions_projectId_fkey";

-- DropIndex
DROP INDEX "page_exclusions_projectId_idx";

-- AlterTable
ALTER TABLE "page_exclusions" DROP COLUMN "createdAt",
DROP COLUMN "matchType",
DROP COLUMN "projectId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "rule" "PatternMatchType" NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "new_translation_enabled" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "selector_exclusions";

-- CreateTable
CREATE TABLE "block_exclusions" (
    "id" TEXT NOT NULL,
    "selector" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "block_exclusions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "block_exclusions_project_id_idx" ON "block_exclusions"("project_id");

-- CreateIndex
CREATE INDEX "page_exclusions_project_id_idx" ON "page_exclusions"("project_id");

-- AddForeignKey
ALTER TABLE "block_exclusions" ADD CONSTRAINT "block_exclusions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_exclusions" ADD CONSTRAINT "page_exclusions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
