import { getSubtitlesFromS3Bucket, uploadSubtitlesToS3Bucket } from "./utils/s3";
import { getVideoWithMissingSubtitles, markVideoAsNotHavingAutoSubs } from "./utils/db/video";
import logger from "./utils/logger";
import { downloadSubtitles } from "./utils/yt-dlp-client";
import fs from "fs";
import sleepSeconds from "./utils/sleep-seconds";
import { saveTranscript } from "./utils/db/transcript";

const oneDayInMs = 24 * 60 * 60 * 1000;
const oneWeekAgo = new Date().getTime() - 14 * oneDayInMs;

async function main() {
  logger.debug("Starting subtitles job");
  const fetchLimit = parseInt(process.env.SUBTITLES_CRONJOB_FETCH_LIMIT || "50");
  const videos = await getVideoWithMissingSubtitles(fetchLimit);

  let processedCount = 0;
  let unprocessedCount = 0;
  for (const video of videos) {
    logger.info(`Getting subtitles for ${video.youtubeId}`);
    const subtitlesSRTString = await getSubtitlesFromS3Bucket(video.youtubeId, video.durationSec);
    if (subtitlesSRTString) {
      logger.debug(`Got subtitles from aws for ${video.youtubeId}`);
      processedCount += 1;
      await saveTranscript(video, subtitlesSRTString);
    } else {
      logger.debug(
        `No subtitles in S3 bucket. Getting subtitles for ${video.youtubeId} using yt-dlp`
      );
      const { filePath, subtitlesSRTString, missingYoutubeSubtitles } = await downloadSubtitles(
        video.youtubeId
      );

      if (subtitlesSRTString) {
        processedCount += 1;
        await saveTranscript(video, subtitlesSRTString);
        await uploadSubtitlesToS3Bucket(video.youtubeId, video.durationSec, subtitlesSRTString);
        fs.unlinkSync(filePath);
        await sleepSeconds(5);
      } else {
        unprocessedCount += 1;
        if (missingYoutubeSubtitles) {
          logger.debug(`Youtube doesn't have auto-generated subtitles for ${video.youtubeId}`);
          if (video.date.getTime() < oneWeekAgo) {
            logger.info(
              `Marking ${video.youtubeId} as not having youtube subtitles since it's already been a week.`
            );
            await markVideoAsNotHavingAutoSubs(video.youtubeId);
          }
        } else {
          logger.error(`Skipping ${video.youtubeId}. No subtitles`);
        }
        continue;
      }
    }
  }
  logger.info(`Subtitles job ended`, { processedCount, unprocessedCount });
}

if (process.env.SUBTITLES_CRONJOB_ENABLED === "true") {
  main().catch((e) => console.error(e));
}
