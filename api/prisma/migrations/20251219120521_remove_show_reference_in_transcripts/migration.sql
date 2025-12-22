/*
  Warnings:

  - You are about to drop the column `showId` on the `Transcript` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transcript" DROP CONSTRAINT "Transcript_showId_fkey";

-- AlterTable
ALTER TABLE "public"."Transcript" DROP COLUMN "showId";
