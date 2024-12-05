-- AlterTable
ALTER TABLE "users" ADD COLUMN     "planAlias" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "plan_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "plans" (
    "id" SERIAL NOT NULL,
    "plan_name" TEXT NOT NULL,
    "plan_alias" TEXT NOT NULL,
    "words_limit" INTEGER NOT NULL,
    "languages_limit" INTEGER NOT NULL,
    "projects_limit" INTEGER NOT NULL,
    "monthly_price" DOUBLE PRECISION NOT NULL,
    "yearly_price" DOUBLE PRECISION NOT NULL,
    "monthly_paddle_id" INTEGER NOT NULL,
    "yearly_paddle_id" INTEGER NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plans_id_plan_alias_idx" ON "plans"("id", "plan_alias");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
