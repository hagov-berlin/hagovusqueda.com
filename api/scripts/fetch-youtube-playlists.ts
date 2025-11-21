import { PrismaClient } from "@prisma/client";
import { importYoutubePlaylist } from "./import-youtube-playlist";
import logger from "./utils/logger";

const prisma = new PrismaClient();

class PlaylistSyncJob {
  async start() {
    logger.info("Starting playlist job");
    const playlists = await prisma.youtubePlaylist.findMany();
    logger.debug(`Found ${playlists.length} playlists`);

    for (const playlist of playlists) {
      const show = await prisma.show.findFirst({ where: { id: playlist.showId } });
      logger.debug(`Updating from playlist ${show.name} ${playlist.youtubeId}`);
      const fetchLimit = 50;
      await importYoutubePlaylist(prisma, playlist, fetchLimit);
    }
    logger.info("Playlist job ended");
  }
}

async function main() {
  const playlistJob = new PlaylistSyncJob();
  playlistJob.start();
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
