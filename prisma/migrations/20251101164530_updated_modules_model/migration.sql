-- AlterTable
ALTER TABLE "Modules" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
