import { exec } from "child_process";
import util from "node:util";
import path from "path";
import logger from "./logger";
import fs from "fs";

const execPromise = util.promisify(exec);

export async function downloadSubtitles(videoId: string) {
  const outputPath = path.join("/tmp", videoId);
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const command = `yt-dlp "${videoUrl}" --skip-download --write-auto-sub --sub-lang "es" --sub-format srt --output "${outputPath}"`;
  logger.debug(`Downloading subtitles for ${videoId} using yt-dlp`);
  const { stdout, stderr } = await execPromise(command);

  const srtPath = `${outputPath}.es.srt`;
  if (fs.existsSync(srtPath)) {
    return {
      filePath: srtPath,
      subtitlesSRTString: fs.readFileSync(srtPath).toString(),
    };
  }

  if (stdout.length > 0) {
    logger.error(stdout);
  }
  if (stderr.length > 0) {
    logger.error(stderr);
  }
  logger.error(`SRT subtitle file downloaded using yt-dlp for ${videoId} not found`);
  return {
    filePath: null,
    subtitlesSRTString: null,
  };
}

export async function downloadMP3(videoId: string, outputPath: string) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const command = `yt-dlp "${videoUrl}" -x --audio-format mp3 --audio-quality 10 --output "${outputPath}"`;
  logger.debug(`Downloading mp3 for ${videoId} using yt-dlp`);
  const { stdout, stderr } = await execPromise(command);
  logger.debug(stdout);
  logger.error(stderr);
}
