import { PrismaClient } from "@prisma/client";
import { importYoutubePlaylist } from "./import-youtube-playlist";
import { importYoutubeSubtitles } from "./import-youtube-subtitles";

async function main(prismaClient: PrismaClient) {
  const playlists = await prisma.youtubePlaylist.findMany();
  for (const playlist of playlists) {
    if (playlist.showId >= 20) {
      // await importYoutubePlaylist(prismaClient, playlist, 1000);
    }
  }
  await importYoutubeSubtitles(prismaClient);
}

const prisma = new PrismaClient();

main(prisma)
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
