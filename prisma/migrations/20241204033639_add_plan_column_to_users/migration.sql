/*
  Warnings:

  - You are about to drop the column `planId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_planId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "planId",
ADD COLUMN     "planAlias" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "plan_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
