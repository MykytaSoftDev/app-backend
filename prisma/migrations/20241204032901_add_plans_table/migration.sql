/*
  Warnings:

  - You are about to drop the column `planAlias` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_plan_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "planAlias",
DROP COLUMN "plan_id",
ADD COLUMN     "planId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
