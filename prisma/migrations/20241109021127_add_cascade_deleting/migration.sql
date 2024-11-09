/*
  Warnings:

  - The values [Wordpress,Joomla,SquareSpace,Shopify,Other] on the enum `Platform` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Platform_new" AS ENUM ('wordpress', 'joomla', 'squarespace', 'shopify', 'other');
ALTER TABLE "domains" ALTER COLUMN "platform" TYPE "Platform_new" USING ("platform"::text::"Platform_new");
ALTER TYPE "Platform" RENAME TO "Platform_old";
ALTER TYPE "Platform_new" RENAME TO "Platform";
DROP TYPE "Platform_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_domain_id_fkey";

-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_domain_id_fkey";

-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_page_id_fkey";

-- DropForeignKey
ALTER TABLE "translations" DROP CONSTRAINT "translations_user_id_fkey";

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
