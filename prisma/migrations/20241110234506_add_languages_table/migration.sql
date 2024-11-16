-- CreateEnum
CREATE TYPE "Support" AS ENUM ('google', 'deepl');

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "title_native" TEXT NOT NULL,
    "code2" TEXT NOT NULL,
    "code3" TEXT NOT NULL,
    "is_right_to_left" BOOLEAN NOT NULL,
    "support" "Support" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_title_key" ON "Language"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Language_title_native_key" ON "Language"("title_native");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code2_key" ON "Language"("code2");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code3_key" ON "Language"("code3");
