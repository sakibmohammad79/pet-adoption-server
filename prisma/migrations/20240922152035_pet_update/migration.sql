/*
  Warnings:

  - You are about to drop the column `idDeleted` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `pets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "idDeleted",
DROP COLUMN "published",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
