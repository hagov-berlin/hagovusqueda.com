/*
  Warnings:

  - You are about to drop the `Subtitle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Subtitle" DROP CONSTRAINT "Subtitle_videoId_fkey";

-- DropTable
DROP TABLE "public"."Subtitle";
