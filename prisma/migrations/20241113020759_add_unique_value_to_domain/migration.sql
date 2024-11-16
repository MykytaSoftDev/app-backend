/*
  Warnings:

  - A unique constraint covering the columns `[user_id,domain_name]` on the table `domains` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "domains_user_id_domain_name_key" ON "domains"("user_id", "domain_name");
