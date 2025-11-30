import { getSubtitlesFromS3Bucket, uploadSubtitlesToS3Bucket } from "./utils/s3";
import { getVideoWithMissingSubtitles, markVideoAsNotHavingAutoSubs } from "./utils/db/video";
import logger from "./utils/logger";
import { downloadSubtitles } from "./utils/yt-dlp-client";
import fs from "fs";
import srtToArray from "./utils/srt-to-array";
import { createMany } from "./utils/db/subtitles";
import { saveTranscript } from "./utils/db/transcript";
import { YoutubeVideo } from "@prisma/client";

async function sleepSeconds(seconds: number) {
  logger.info(`Sleeping ${seconds} seconds`);
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
}

async function processSubtitleSRT(video: YoutubeVideo, subtitlesSRTString: string) {
  logger.info(`Saving transcript and subtitles for video ${video.youtubeId}`);
  const subtitlesArray = srtToArray(subtitlesSRTString);
  await saveTranscript(video, subtitlesArray, subtitlesSRTString, "youtube-auto-generated");
  await createMany(video, subtitlesArray, "youtube-auto-generated");
}

async function main() {
  logger.info("Starting subtitles job");
  const videos = await getVideoWithMissingSubtitles(5);
  for (const video of videos) {
    await sleepSeconds(5);
    logger.info(`Getting subtitles for ${video.youtubeId}`);
    const subtitlesSRTString = await getSubtitlesFromS3Bucket(video.youtubeId);
    if (subtitlesSRTString) {
      logger.info(`Got subtitles from aws for ${video.youtubeId}`);
      await processSubtitleSRT(video, subtitlesSRTString);
    } else {
      logger.debug(
        `No subtitles in S3 bucket. Getting subtitles for ${video.youtubeId} using yt-dlp`
      );
      const { filePath, subtitlesSRTString, missingYoutubeSubtitles } = await downloadSubtitles(
        video.youtubeId
      );
      if (!subtitlesSRTString) {
        if (missingYoutubeSubtitles) {
          logger.info(`Youtube doesn't have auto-generated subtitles for ${video.youtubeId}`);
          await markVideoAsNotHavingAutoSubs(video.youtubeId);
        } else {
          logger.error(`Skipping ${video.youtubeId}. No subtitles`);
        }
        continue;
      }
      await processSubtitleSRT(video, subtitlesSRTString);
      await uploadSubtitlesToS3Bucket(video.youtubeId, subtitlesSRTString);
      fs.unlinkSync(filePath);
    }
  }
  logger.info("Subtitles job ended");
}

if (process.env.SUBTITLES_CRONJOB_ENABLED === "true") {
  main().catch((e) => console.error(e));
}
