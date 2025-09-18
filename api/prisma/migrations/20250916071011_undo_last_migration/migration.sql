/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Show` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `YoutubeChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Show" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "public"."YoutubeChannel" DROP COLUMN "imageUrl";
