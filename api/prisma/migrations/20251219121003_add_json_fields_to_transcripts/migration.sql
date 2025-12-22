-- AlterTable
ALTER TABLE "public"."Transcript" ADD COLUMN     "subtitles" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "timestamps" JSONB NOT NULL DEFAULT '[]';
