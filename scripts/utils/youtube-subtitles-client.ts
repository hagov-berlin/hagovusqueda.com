import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "node:util";

const execPromise = util.promisify(exec);

function timeToSeconds(rawTimeString: string) {
  if (!rawTimeString.includes(",")) throw new Error(`Cannot parse "${rawTimeString}"`);
  const [timeString, millisecondsString] = rawTimeString.split(",");
  const [hoursString, minutesString, secondsString] = timeString.split(":");
  const milliseconds = parseInt(millisecondsString, 10);
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);
  const seconds = parseInt(secondsString, 10);
  return milliseconds + (seconds + minutes * 60 + hours * 60 * 60) * 1000;
}

const videosWithoutSubtitles = [
  "t7htTMSCEUc", // especial
  "o8GcyZUzVfQ", // DI
  "7AN1Uj7XiyA", // DI
  "ellahOgTwxk", // EO
  "pq2mnDUOCbE", // DI
  "oemMogZlZ-w", // Video removed
  "VxQA4UBWLLY", // Triangulo de hierro
  "qHY7SNppTOE", // Triangulo de hierro
  "kOZEo6flxow", // La broma infinita
  "utU7Rfm36FY", // Video removed
  "aoMR35fpOsk", // La broma infinita
  "xEC0NIwQVzs", // La broma infinita
  "mckh_itq0_s", // La broma infinita
  "wsPEXqAp0Vs", // La broma infinita
  "XuBOIJPtIF4", // Video removed
];

export type Subtitle = [string, number, number];

function convertSrtToArray(subtitleContent: string): Subtitle[] {
  const subtitlesRaw = subtitleContent.split("\n\n").filter((line) => line);
  const subtitleArray: Subtitle[] = [];
  for (const subtitleRaw of subtitlesRaw) {
    const lines = subtitleRaw.split("\n");
    if (lines.length !== 3) continue;
    const [startTime, endTime] = lines[1].split(" --> ");
    const text = lines[2];
    subtitleArray.push([text, timeToSeconds(startTime), timeToSeconds(endTime)]);
  }
  return subtitleArray;
}

export async function getSubtitlesForVideo(
  videoId: string,
  deleteTmpFile: boolean = false
): Promise<Subtitle[]> {
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
      // console.log(stdout);
      // console.error(stderr);
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

  // console.log(`Converting raw subtitle to JSON for video ${videoId}`);
  const subtitleArray = convertSrtToArray(subtitleString);

  if (deleteTmpFile) {
    fs.unlinkSync(outputPathWithExtension);
  }
  return subtitleArray;
}
