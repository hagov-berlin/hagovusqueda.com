import { PrismaClient } from "@prisma/client";
import logger from "./utils/logger";
import { upsertVideo, videoAlreadyExists, deleteVideo } from "./utils/db/video";
import getVideosFromPlaylist from "./utils/youtube-api/get-videos-from-playlist";

const prisma = new PrismaClient();

async function main() {
  logger.info("Starting playlist job");
  const playlists = await prisma.youtubePlaylist.findMany();
  logger.debug(`Found ${playlists.length} playlists`);

  for (const playlist of playlists) {
    const show = await prisma.show.findFirst({ where: { id: playlist.showId } });
    logger.debug(`Updating from playlist ${show.name} ${playlist.youtubeId}`);

    const fetchLimit = 50;
    const videos = await getVideosFromPlaylist(playlist, fetchLimit);

    for (const video of videos) {
      const alreadyExists = await videoAlreadyExists(video.videoId);
      if (alreadyExists && video.private) {
        logger.info(`Removing video ${video.videoId}`);
        await deleteVideo(video.videoId);
      } else if (!video.private) {
        if (alreadyExists) {
          logger.debug(`Updating video ${video.videoId}`);
        } else {
          logger.info(`New video ${video.videoId}`);
        }
        await upsertVideo(playlist, video);
      }
    }
  }

  logger.info("Playlist job ended");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
