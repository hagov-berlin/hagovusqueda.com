/*
  Warnings:

  - A unique constraint covering the columns `[videoId,type]` on the table `Transcript` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transcript_videoId_type_key" ON "public"."Transcript"("videoId", "type");
