import { PrismaClient, YoutubePlaylist } from "@prisma/client";
import { request } from "./utils/youtube-api-client";
import slugify from "slugify";
import logger from "./utils/logger";

export async function importYoutubePlaylist(
  prisma: PrismaClient,
  playlist: YoutubePlaylist,
  limit: number = Number.MAX_SAFE_INTEGER
) {
  let nextPageToken: string | null;
  let processedCount = 0;

  do {
    logger.debug(`Requesting playlist ${playlist.youtubeId}`);
    const response = await request(playlist.youtubeId, nextPageToken);
    nextPageToken = response.nextPageToken;

    for (const video of response.videos) {
      const payload = {
        youtubeId: video.videoId,
        title: video.title,
        slug: slugify(video.title.replace(/[\|\$]/g, ""), {
          lower: true,
          strict: true,
          locale: "es",
        }),
        date: new Date(video.date),
        durationSec: video.duration,
        channelId: playlist.channelId ? playlist.channelId : undefined,
        showId: playlist.showId ? playlist.showId : undefined,
        ignored: playlist.showId ? false : undefined,
      };
      const videoAlreadyExists = !!(await prisma.youtubeVideo.findFirst({
        where: { youtubeId: video.videoId },
      }));
      if (videoAlreadyExists) {
        logger.debug(`Updating video ${video.videoId}`);
      } else {
        logger.info(`New video ${video.videoId}`);
      }
      await prisma.youtubeVideo.upsert({
        where: { youtubeId: video.videoId },
        update: payload,
        create: payload,
      });
      processedCount += 1;
    }
  } while (processedCount < limit && nextPageToken);
}
