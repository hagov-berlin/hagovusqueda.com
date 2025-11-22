/*
  Warnings:

  - Added the required column `text` to the `Transcript` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Transcript" ADD COLUMN     "text" TEXT NOT NULL;
