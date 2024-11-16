/*
  Warnings:

  - You are about to drop the column `projectName` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "projectName",
ADD COLUMN     "project_name" TEXT NOT NULL DEFAULT 'My Website';
