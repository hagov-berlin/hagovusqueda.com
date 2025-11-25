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

export type Subtitle = [string, number, number];

export default function srtToArray(subtitleContent: string): Subtitle[] {
  const subtitlesRaw = subtitleContent.split("\n\n").filter((line) => line);
  const subtitleArray: Subtitle[] = [];
  for (const subtitleRaw of subtitlesRaw) {
    const lines = subtitleRaw.split("\n");
    if (lines.length !== 3) continue;
    const [startTime, endTime] = lines[1].split(" --> ");
    const text = lines.slice(2).join(" ");
    subtitleArray.push([text, timeToSeconds(startTime), timeToSeconds(endTime)]);
  }
  return subtitleArray;
}
