/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Language";

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "title_native" TEXT NOT NULL,
    "code2" TEXT NOT NULL,
    "code3" TEXT NOT NULL,
    "is_right_to_left" BOOLEAN NOT NULL,
    "support" "Support" NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "languages_title_key" ON "languages"("title");

-- CreateIndex
CREATE UNIQUE INDEX "languages_title_native_key" ON "languages"("title_native");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code2_key" ON "languages"("code2");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code3_key" ON "languages"("code3");

-- CreateIndex
CREATE INDEX "languages_id_code2_idx" ON "languages"("id", "code2");
