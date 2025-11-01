/*
  Warnings:

  - Added the required column `theme` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('EARTHQUAKE', 'FLOOD', 'TSUNAMI', 'VOLCANO', 'FOREST_FIRE');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "theme" "QuestionType" NOT NULL;
