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

  let stdout = "";
  let stderr = "";
  try {
    const commandReponse = await execPromise(command);
    stderr = commandReponse.stderr;
    stdout = commandReponse.stdout;
  } catch (error) {
    logger.error(`Catched error`, error);
    stderr = error.stderr;
    stdout = error.stdout;
  }

  logger.debug(stdout);
  logger.debug(stderr);

  const srtPath = `${outputPath}.es.srt`;
  if (fs.existsSync(srtPath)) {
    return {
      filePath: srtPath,
      subtitlesSRTString: fs.readFileSync(srtPath).toString(),
      missingYoutubeSubtitles: false,
    };
  }

  const missingYoutubeSubtitles =
    stdout.includes("There are no subtitles for the requested languages") ||
    stderr.includes("Video unavailable");
  if (missingYoutubeSubtitles) {
    return {
      filePath: null,
      subtitlesSRTString: null,
      missingYoutubeSubtitles: true,
    };
  }

  logger.error(`SRT subtitle file downloaded using yt-dlp for ${videoId} not found`);
  if (stdout.length > 0) {
    logger.error(stdout);
  }
  if (stderr.length > 0) {
    logger.error(stderr);
  }
  return {
    filePath: null,
    subtitlesSRTString: null,
    missingYoutubeSubtitles: null,
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
