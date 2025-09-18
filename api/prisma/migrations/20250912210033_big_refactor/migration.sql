/*
  Warnings:

  - You are about to drop the column `endTime` on the `Subtitle` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Subtitle` table. All the data in the column will be lost.
  - The primary key for the `YoutubeVideo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `duration` on the `YoutubeVideo` table. All the data in the column will be lost.
  - You are about to drop the column `show` on the `YoutubeVideo` table. All the data in the column will be lost.
  - The `id` column on the `YoutubeVideo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `endTimeMs` to the `Subtitle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Subtitle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTimeMs` to the `Subtitle` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `videoId` on the `Subtitle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `durationSec` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `youtubeId` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Subtitle" DROP CONSTRAINT "Subtitle_videoId_fkey";

-- DropIndex
DROP INDEX "public"."YoutubeVideo_show_idx";

-- AlterTable
ALTER TABLE "public"."Subtitle" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "endTimeMs" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "startTimeMs" INTEGER NOT NULL,
DROP COLUMN "videoId",
ADD COLUMN     "videoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."YoutubeVideo" DROP CONSTRAINT "YoutubeVideo_pkey",
DROP COLUMN "duration",
DROP COLUMN "show",
ADD COLUMN     "channelId" INTEGER,
ADD COLUMN     "durationSec" INTEGER NOT NULL,
ADD COLUMN     "showId" INTEGER,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "youtubeId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "YoutubeVideo_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."YoutubeChannel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,

    CONSTRAINT "YoutubeChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Show" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YoutubePlaylist" (
    "id" SERIAL NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "showId" INTEGER,
    "channelId" INTEGER,

    CONSTRAINT "YoutubePlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "YoutubeChannel_slug_idx" ON "public"."YoutubeChannel"("slug");

-- CreateIndex
CREATE INDEX "Show_slug_idx" ON "public"."Show"("slug");

-- CreateIndex
CREATE INDEX "Show_channelId_idx" ON "public"."Show"("channelId");

-- CreateIndex
CREATE INDEX "Subtitle_videoId_idx" ON "public"."Subtitle"("videoId");

-- CreateIndex
CREATE INDEX "Subtitle_order_idx" ON "public"."Subtitle"("order");

-- CreateIndex
CREATE INDEX "YoutubeVideo_slug_idx" ON "public"."YoutubeVideo"("slug");

-- CreateIndex
CREATE INDEX "YoutubeVideo_showId_idx" ON "public"."YoutubeVideo"("showId");

-- CreateIndex
CREATE INDEX "YoutubeVideo_channelId_idx" ON "public"."YoutubeVideo"("channelId");

-- AddForeignKey
ALTER TABLE "public"."Show" ADD CONSTRAINT "Show_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."YoutubeChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YoutubePlaylist" ADD CONSTRAINT "YoutubePlaylist_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YoutubePlaylist" ADD CONSTRAINT "YoutubePlaylist_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."YoutubeChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."YoutubeChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subtitle" ADD CONSTRAINT "Subtitle_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."YoutubeVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
