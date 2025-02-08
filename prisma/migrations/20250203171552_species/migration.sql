/*
  Warnings:

  - The values [Fish] on the enum `Species` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Species_new" AS ENUM ('DOG', 'CAT', 'RABBIT', 'BIRD');
ALTER TABLE "pets" ALTER COLUMN "species" TYPE "Species_new" USING ("species"::text::"Species_new");
ALTER TYPE "Species" RENAME TO "Species_old";
ALTER TYPE "Species_new" RENAME TO "Species";
DROP TYPE "Species_old";
COMMIT;
