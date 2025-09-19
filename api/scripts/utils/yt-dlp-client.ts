import { exec } from "child_process";
import util from "node:util";

const execPromise = util.promisify(exec);

export async function downloadSubtitles(videoId: string, outputPath: string) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const command = `yt-dlp "${videoUrl}" --skip-download --write-auto-sub --sub-lang "es" --sub-format srt --output "${outputPath}"`;
  console.log(`Downloading subtitles for ${videoId}`);
  const { stdout, stderr } = await execPromise(command);
  console.log(stdout);
  console.error(stderr);
}

export async function downloadMP3(videoId: string, outputPath: string) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const command = `yt-dlp "${videoUrl}" -x --audio-format mp3 --audio-quality 10 --output "${outputPath}"`;
  console.log(`Downloading mp3 for ${videoId}`);
  const { stdout, stderr } = await execPromise(command);
  console.log(stdout);
  console.error(stderr);
}
