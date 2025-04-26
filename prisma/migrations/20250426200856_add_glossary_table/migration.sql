-- CreateEnum
CREATE TYPE "GlossaryBehavior" AS ENUM ('translate', 'keep_original');

-- CreateTable
CREATE TABLE "glossary" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "source_text" TEXT NOT NULL,
    "target_text" TEXT,
    "source_language" TEXT NOT NULL,
    "target_language" TEXT NOT NULL,
    "behavior" "GlossaryBehavior" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "glossary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "glossary_project_id_idx" ON "glossary"("project_id");

-- CreateIndex
CREATE INDEX "glossary_user_id_idx" ON "glossary"("user_id");

-- AddForeignKey
ALTER TABLE "glossary" ADD CONSTRAINT "glossary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "glossary" ADD CONSTRAINT "glossary_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
