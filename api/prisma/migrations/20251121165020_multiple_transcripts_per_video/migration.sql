/*
  Warnings:

  - You are about to drop the column `transcript` on the `YoutubeVideo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."YoutubeVideo" DROP COLUMN "transcript";

-- CreateTable
CREATE TABLE "public"."Transcript" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transcript_videoId_idx" ON "public"."Transcript"("videoId");

-- CreateIndex
CREATE INDEX "Transcript_type_idx" ON "public"."Transcript"("type");

-- CreateIndex
CREATE INDEX "Transcript_videoId_type_idx" ON "public"."Transcript"("videoId", "type");

-- AddForeignKey
ALTER TABLE "public"."Transcript" ADD CONSTRAINT "Transcript_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."YoutubeVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transcript" ADD CONSTRAINT "Transcript_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
