import { YoutubeVideo } from "@prisma/client";
import { Subtitle } from "../srt-to-array";
import prismaClient from "./prisma-client";
import logger from "../logger";

function normalizeText(text: string) {
  // TODO: merge this function with the one in the search endpoint
  text = text.replace(/[\[\],\.¿\?¡!\-"'%`:$€+\/@²º*]/g, "");
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return text.replace(/\s+/g, " ").toLocaleLowerCase();
}

export async function saveTranscript(
  video: YoutubeVideo,
  subtitles: Subtitle[],
  srtString: string,
  type: string
) {
  if (!video.showId) throw new Error(`Missing showId while saving transcript`);

  const joinedSubtitles = subtitles.map((subtitles) => subtitles[0]).join(" ");
  const text = normalizeText(joinedSubtitles);

  const payload = {
    videoId: video.id,
    showId: video.showId,
    type,
    text,
    srt: srtString,
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
