/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Show` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `YoutubeChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Show_slug_key" ON "public"."Show"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeChannel_slug_key" ON "public"."YoutubeChannel"("slug");
