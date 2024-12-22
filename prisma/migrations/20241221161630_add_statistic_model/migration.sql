-- CreateTable
CREATE TABLE "user_statistic" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "target_language" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_statistic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_statistic_user_id_project_id_page_id_idx" ON "user_statistic"("user_id", "project_id", "page_id");

-- AddForeignKey
ALTER TABLE "user_statistic" ADD CONSTRAINT "user_statistic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statistic" ADD CONSTRAINT "user_statistic_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statistic" ADD CONSTRAINT "user_statistic_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
