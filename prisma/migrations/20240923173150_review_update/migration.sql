/*
  Warnings:

  - You are about to drop the column `reviewerId` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "adopter_review_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "publisher_review_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "reviewerId",
ADD COLUMN     "adopterId" TEXT,
ADD COLUMN     "publisherId" TEXT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "adopters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
