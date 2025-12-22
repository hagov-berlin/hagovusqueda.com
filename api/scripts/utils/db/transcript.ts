import { YoutubeVideo } from "@prisma/client";
import srtToArray from "../srt-to-array";
import prismaClient from "./prisma-client";
import logger from "../logger";
import { normalizeText } from "../../../src/search/utils";

export async function saveTranscript(video: YoutubeVideo, srtString: string) {
  if (!video.showId) throw new Error(`Missing showId while saving transcript`);
  logger.info(`Saving transcript and subtitles for video ${video.youtubeId}`);

  const subtitles = srtToArray(srtString);
  const type = "youtube-auto-generated";

  const normalizedSubtitles = subtitles.map((subtitles) => normalizeText(subtitles[0]));
  const text = normalizedSubtitles.join(" ");

  const payload = {
    videoId: video.id,
    type,
    text,
    srt: srtString,
    subtitles,
  };
  logger.debug(`Saving transcript for video ${video.youtubeId} to DB`);
  await prismaClient.transcript.upsert({
    where: {
      video_id_type: {
        videoId: video.id,
        type,
      },
    },
    update: payload,
    create: payload,
  });
}
