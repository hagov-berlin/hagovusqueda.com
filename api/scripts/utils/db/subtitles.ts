import { YoutubeVideo } from "@prisma/client";
import { Subtitle } from "../srt-to-array";
import prismaClient from "./prisma-client";
import logger from "../logger";

export async function createMany(video: YoutubeVideo, subtitles: Subtitle[], type: string) {
  logger.debug(`Saving subtitles for video ${video.youtubeId} to DB`);
  const data = subtitles.map((subtitle, index) => {
    return {
      text: subtitle[0],
      startTimeMs: subtitle[1],
      endTimeMs: subtitle[2],
      videoId: video.id,
      order: index,
      type,
    };
  });
  await prismaClient.subtitle.createMany({
    data,
  });
}
