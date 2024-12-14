-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Platform" ADD VALUE 'bigcommerce';
ALTER TYPE "Platform" ADD VALUE 'bubble';
ALTER TYPE "Platform" ADD VALUE 'drupal';
ALTER TYPE "Platform" ADD VALUE 'jimdo';
ALTER TYPE "Platform" ADD VALUE 'magento';
ALTER TYPE "Platform" ADD VALUE 'prestashop';
ALTER TYPE "Platform" ADD VALUE 'salesforce';
ALTER TYPE "Platform" ADD VALUE 'squareonline';
ALTER TYPE "Platform" ADD VALUE 'webflow';
ALTER TYPE "Platform" ADD VALUE 'weebly';
ALTER TYPE "Platform" ADD VALUE 'wix';
