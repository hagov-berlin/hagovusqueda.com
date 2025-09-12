/*
  Warnings:

  - A unique constraint covering the columns `[youtubeId]` on the table `YoutubeChannel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[youtubeId]` on the table `YoutubePlaylist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[youtubeId]` on the table `YoutubeVideo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "YoutubeChannel_youtubeId_key" ON "public"."YoutubeChannel"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubePlaylist_youtubeId_key" ON "public"."YoutubePlaylist"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeVideo_youtubeId_key" ON "public"."YoutubeVideo"("youtubeId");
