/*
  Warnings:

  - You are about to drop the column `flag_type` on the `project_settings` table. All the data in the column will be lost.
  - You are about to drop the column `flags` on the `project_settings` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `project_settings` table. All the data in the column will be lost.
  - You are about to drop the column `widget_corners` on the `project_settings` table. All the data in the column will be lost.
  - The `widget_style` column on the `project_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('rightBottom', 'leftBottom', 'rightTop', 'leftTop');

-- CreateEnum
CREATE TYPE "TitleDisplayMode" AS ENUM ('none', 'default', 'native', 'code2', 'code3');

-- CreateEnum
CREATE TYPE "FlagDisplayMode" AS ENUM ('none', 'rectangle', 'circle');

-- CreateEnum
CREATE TYPE "WidgetDisplayMode" AS ENUM ('dropdown', 'popup');

-- CreateEnum
CREATE TYPE "WidgetStyle" AS ENUM ('rectangle', 'round');

-- AlterTable
ALTER TABLE "project_settings" DROP COLUMN "flag_type",
DROP COLUMN "flags",
DROP COLUMN "title",
DROP COLUMN "widget_corners",
ADD COLUMN     "custom_position" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "flag_display_mode" "FlagDisplayMode" NOT NULL DEFAULT 'circle',
ADD COLUMN     "position" "Position" NOT NULL DEFAULT 'rightBottom',
ADD COLUMN     "title_display_mode" "TitleDisplayMode" NOT NULL DEFAULT 'native',
ADD COLUMN     "widget_display_mode" "WidgetDisplayMode" NOT NULL DEFAULT 'dropdown',
DROP COLUMN "widget_style",
ADD COLUMN     "widget_style" "WidgetStyle" NOT NULL DEFAULT 'rectangle';

-- DropEnum
DROP TYPE "StyleRadius";
