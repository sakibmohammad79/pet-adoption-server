/*
  Warnings:

  - You are about to drop the column `name` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `adopters` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `publishers` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `adopters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `adopters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `publishers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `publishers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "name",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "contactNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "adopters" DROP COLUMN "name",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "name",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "publishers" DROP COLUMN "name",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "lastName" TEXT NOT NULL;
