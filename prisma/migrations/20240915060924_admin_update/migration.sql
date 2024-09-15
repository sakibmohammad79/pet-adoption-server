-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
