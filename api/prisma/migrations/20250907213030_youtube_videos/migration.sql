/*
  Warnings:

  - Added the required column `date` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."YoutubeVideo" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "show" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
