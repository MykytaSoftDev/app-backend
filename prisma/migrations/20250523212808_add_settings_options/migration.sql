-- AlterTable
ALTER TABLE "project_settings" ADD COLUMN     "auto_redirect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dynamic_translation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parse_docs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parse_images" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parse_videos" BOOLEAN NOT NULL DEFAULT false;
