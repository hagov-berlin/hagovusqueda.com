-- AlterTable
ALTER TABLE "public"."YoutubeVideo" ADD COLUMN     "parentVideoId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_parentVideoId_fkey" FOREIGN KEY ("parentVideoId") REFERENCES "public"."YoutubeVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
