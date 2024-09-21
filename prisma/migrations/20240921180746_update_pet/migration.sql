/*
  Warnings:

  - You are about to drop the column `firstName` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `pets` table. All the data in the column will be lost.
  - Added the required column `color` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "specialNeeds" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;
