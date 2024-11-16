/*
  Warnings:

  - You are about to drop the column `domain_id` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the column `domain_id` on the `translations` table. All the data in the column will be lost.
  - You are about to drop the `domains` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `project_id` to the `pages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `translations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StyleRadius" AS ENUM ('rectangle', 'square', 'circle');

-- CreateEnum
CREATE TYPE "UrlStructure" AS ENUM ('default', 'subdomain', 'subdirectory');

-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_domain_id_fkey";

-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_domain_id_fkey";

-- DropIndex
DROP INDEX "pages_user_id_domain_id_idx";

-- DropIndex
DROP INDEX "translations_domain_id_idx";

-- AlterTable
ALTER TABLE "pages" DROP COLUMN "domain_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "translations" DROP COLUMN "domain_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "domains";

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "domain_name" TEXT NOT NULL,
    "projectName" TEXT NOT NULL DEFAULT 'My Website',
    "platform" "Platform",
    "source_language" TEXT NOT NULL,
    "target_languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "words_count" INTEGER DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "is_activated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_settings" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "flags" BOOLEAN NOT NULL DEFAULT true,
    "flag_type" "StyleRadius" NOT NULL DEFAULT 'circle',
    "title" BOOLEAN NOT NULL DEFAULT true,
    "widget_style" TEXT NOT NULL DEFAULT 'dropdown',
    "widget_corners" "StyleRadius" NOT NULL DEFAULT 'rectangle',
    "url_structure" "UrlStructure" NOT NULL DEFAULT 'default',

    CONSTRAINT "project_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "projects_user_id_domain_name_idx" ON "projects"("user_id", "domain_name");

-- CreateIndex
CREATE UNIQUE INDEX "projects_user_id_domain_name_key" ON "projects"("user_id", "domain_name");

-- CreateIndex
CREATE INDEX "project_settings_project_id_idx" ON "project_settings"("project_id");

-- CreateIndex
CREATE INDEX "pages_user_id_project_id_idx" ON "pages"("user_id", "project_id");

-- CreateIndex
CREATE INDEX "translations_project_id_idx" ON "translations"("project_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_settings" ADD CONSTRAINT "project_settings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
