import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "node:util";

const execPromise = util.promisify(exec);

function timeToSeconds(rawTimeString: string) {
  if (!rawTimeString.includes(",")) throw new Error(`Cannot parse "${rawTimeString}"`);
  const [timeString] = rawTimeString.split(",");
  const [hoursString, minutesString, secondsString] = timeString.split(":");
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);
  const seconds = parseInt(secondsString, 10);
  return seconds + minutes * 60 + hours * 60 * 60;
}

const videosWithoutSubtitles = [
  "t7htTMSCEUc", // especial
  "o8GcyZUzVfQ", // DI
  "7AN1Uj7XiyA", // DI
  "ellahOgTwxk", // EO
  "pq2mnDUOCbE", // DI
];

type Subtitle = [string, number, number];

function convertSrtToArray(subtitleContent: string): Subtitle[] {
  const data = subtitleContent.split("\n").filter((line) => line);
  const subtitleArray: Subtitle[] = [];
  for (let n = 0; n < data.length; n += 3) {
    const [startTime, endTime] = data[n + 1].split(" --> ");
    const text = data[n + 2];
    subtitleArray.push([text, timeToSeconds(startTime), timeToSeconds(endTime)]);
  }
  return subtitleArray;
}

export async function getSubtitlesForVideo(videoId: string): Promise<Subtitle[]> {
  if (videosWithoutSubtitles.includes(videoId)) {
    console.log(`Skipping subtitles for ${videoId}`);
    return [];
  }

  const outputPath = path.join(__dirname, "tmp", videoId);
  const outputPathWithExtension = `${outputPath}.es.srt`;

  if (fs.existsSync(outputPathWithExtension)) {
    console.log(`Skipping download of subtitles for ${videoId}. Already downloaded`);
  } else {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const command = `yt-dlp "${videoUrl}" --skip-download --write-auto-sub --sub-lang "es" --sub-format srt --output "${outputPath}"`;
    console.log(`Downloading subtitles for ${videoId}`);
    try {
      const { stdout, stderr } = await execPromise(command);
      console.log(stdout);
      console.error(stderr);
    } catch (error) {
      console.error("Error downloading subtitles for", videoId);
      console.error(error);
      return [];
    }
  }

  if (!fs.existsSync(outputPathWithExtension)) {
    console.error("Failed downloading subtitles for", videoId);
    return [];
  }
  const subtitleString = fs.readFileSync(outputPathWithExtension).toString();

  console.log(`Converting raw subtitle to JSON for video ${videoId}`);
  const subtitleArray = convertSrtToArray(subtitleString);

  fs.unlinkSync(outputPathWithExtension);
  return subtitleArray;
}
