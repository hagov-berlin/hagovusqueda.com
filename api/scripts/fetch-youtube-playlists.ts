import logger from "./utils/logger";
import { upsertVideo, videoAlreadyExists, deleteVideo } from "./utils/db/video";
import getVideosFromPlaylist from "./utils/youtube-api/get-videos-from-playlist";
import prismaClient from "./utils/db/prisma-client";

async function main() {
  const fetchLimit = process.env.SYNC_WHOLE_PLAYLISTS === "true" ? 5_000 : 50;
  logger.info(`Starting playlist job. Fetch limit per playlist: ${fetchLimit}`);
  const playlists = await prismaClient.youtubePlaylist.findMany();
  logger.debug(`Found ${playlists.length} playlists`);

  for (const playlist of playlists) {
    const show = await prismaClient.show.findFirst({ where: { id: playlist.showId } });
    logger.debug(
      `Found from playlist for ${show.name}. Playlist youtube id: ${playlist.youtubeId}`
    );

    const videos = await getVideosFromPlaylist(playlist, fetchLimit);
    logger.info(
      `Fetched ${videos.length} videos for ${show.name} from youtube playlist ${playlist.youtubeId}`
    );

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

if (process.env.PLAYLIST_CRONJOB_ENABLED === "true") {
  main().catch((e) => console.error(e));
}
