-- CreateTable
CREATE TABLE "public"."Subtitle" (
    "id" SERIAL NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "Subtitle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Subtitle" ADD CONSTRAINT "Subtitle_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."YoutubeVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
