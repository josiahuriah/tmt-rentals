/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Customer_email_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
