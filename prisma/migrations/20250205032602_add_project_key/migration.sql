/*
  Warnings:

  - A unique constraint covering the columns `[project_key]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_key` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "project_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_project_key_key" ON "projects"("project_key");
