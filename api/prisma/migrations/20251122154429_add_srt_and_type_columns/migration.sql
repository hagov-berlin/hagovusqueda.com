/*
  Warnings:

  - Added the required column `type` to the `Subtitle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `srt` to the `Transcript` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Subtitle" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transcript" ADD COLUMN     "srt" TEXT NOT NULL;
