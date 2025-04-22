-- CreateEnum
CREATE TYPE "PatternMatchType" AS ENUM ('equal', 'contain', 'start', 'end');

-- CreateTable
CREATE TABLE "selector_exclusions" (
    "id" TEXT NOT NULL,
    "selector" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "selector_exclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_exclusions" (
    "id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "matchType" "PatternMatchType" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_exclusions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "selector_exclusions_projectId_idx" ON "selector_exclusions"("projectId");

-- CreateIndex
CREATE INDEX "page_exclusions_projectId_idx" ON "page_exclusions"("projectId");

-- AddForeignKey
ALTER TABLE "selector_exclusions" ADD CONSTRAINT "selector_exclusions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_exclusions" ADD CONSTRAINT "page_exclusions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
