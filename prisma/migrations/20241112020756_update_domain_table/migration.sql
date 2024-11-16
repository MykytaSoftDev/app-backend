-- DropIndex
DROP INDEX "domains_domain_name_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "api_key" DROP DEFAULT;
