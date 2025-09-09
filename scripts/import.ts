import { PrismaClient } from "@prisma/client";
import { importBlenderYoutubeVideos } from "./import-blender-youtube-videos";
import { importYoutubeSubtitles } from "./import-youtube-subtitles";

async function main(prismaClient: PrismaClient) {
  await importBlenderYoutubeVideos(prismaClient);
  await importYoutubeSubtitles(prismaClient);
}

const prisma = new PrismaClient();

main(prisma)
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
