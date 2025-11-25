import { getSubtitlesFromS3Bucket, uploadSubtitlesToS3Bucket } from "./utils/s3";
import { getVideoWithMissingSubtitles } from "./utils/db/video";
import logger from "./utils/logger";
import { downloadSubtitles } from "./utils/yt-dlp-client";
import fs from "fs";
import srtToArray from "./utils/srt-to-array";
import { createMany } from "./utils/db/subtitles";
import { saveTranscript } from "./utils/db/transcript";
import { YoutubeVideo } from "@prisma/client";

async function processSubtitleSRT(video: YoutubeVideo, subtitlesSRTString: string) {
  logger.info(`Saving transcript and subtitles for video ${video.youtubeId}`);
  const subtitlesArray = srtToArray(subtitlesSRTString);
  await saveTranscript(video, subtitlesArray, subtitlesSRTString, "youtube-auto-generated");
  await createMany(video, subtitlesArray, "youtube-auto-generated");
}

async function main() {
  logger.info("Starting subtitles job");
  const videos = await getVideoWithMissingSubtitles(100);
  for (const video of videos) {
    logger.info(`Getting subtitles for ${video.youtubeId}`);
    const subtitlesSRTString = await getSubtitlesFromS3Bucket(video.youtubeId);
    if (subtitlesSRTString) {
      logger.info(`Got subtitles from aws for ${video.youtubeId}`);
      await processSubtitleSRT(video, subtitlesSRTString);
    } else {
      logger.info(
        `No subtitles in S3 bucket. Getting subtitles for ${video.youtubeId} using yt-dlp`
      );
      const { filePath, subtitlesSRTString } = await downloadSubtitles(video.youtubeId);
      if (!subtitlesSRTString) {
        logger.error(`Skipping ${video.youtubeId}. No subtitles`);
        continue;
      }
      await processSubtitleSRT(video, subtitlesSRTString);
      await uploadSubtitlesToS3Bucket(video.youtubeId, subtitlesSRTString);
      fs.unlinkSync(filePath);
    }
  }
  logger.info("Subtitles job ended");
}

main().catch((e) => console.error(e));
