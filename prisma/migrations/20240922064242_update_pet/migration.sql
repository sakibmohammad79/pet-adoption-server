/*
  Warnings:

  - The `status` column on the `pets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PetAdoptStatus" AS ENUM ('PENDING', 'REJECTED', 'APPROVED');

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "status",
ADD COLUMN     "status" "PetAdoptStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "PetPublishStatus";
