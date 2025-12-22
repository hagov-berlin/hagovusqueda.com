import { normalizeText } from "../../src/search/utils";

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

export type Subtitle = [
  string, // subtitle text
  number, // start time in milliseconds
  number, // end time in milliseconds
  number, // start index of the subtitle in the whole transcript
  number // end  index of the subtitle in the whole transcript
];

const oneWholeDayInMs = 1000 * 60 * 60 * 24;

export default function srtToArray(subtitleContent: string): Subtitle[] {
  const subtitlesRaw = subtitleContent.split("\n\n").filter((line) => line);
  const subtitleArray: Subtitle[] = [];
  let index = 0;
  for (const subtitleRaw of subtitlesRaw) {
    const lines = subtitleRaw.split("\n");
    if (lines.length !== 3) continue;
    const [startTime, endTime] = lines[1].split(" --> ");
    const text = lines.slice(2).join(" ");
    const normalizedText = normalizeText(text);
    subtitleArray.push([
      text,
      timeToSeconds(startTime),
      timeToSeconds(endTime),
      index,
      index + normalizedText.length,
    ]);
    if (normalizedText.length) {
      index += normalizedText.length + 1;
    }
  }
  const filteredSubtitleArray = subtitleArray.filter((subtitle, index) => {
    const nextSubtitle = subtitleArray[index + 1];
    const nextSubtitleIsTheSame =
      subtitle[0] === nextSubtitle?.[0] &&
      subtitle[1] === nextSubtitle?.[1] &&
      subtitle[2] === nextSubtitle?.[2];
    if (nextSubtitleIsTheSame) return false;
    const firstTimestampIsOk = 0 <= subtitle[1] && subtitle[1] <= oneWholeDayInMs;
    const secondTimestampIsOk = 0 <= subtitle[2] && subtitle[2] <= oneWholeDayInMs;
    return firstTimestampIsOk && secondTimestampIsOk;
  });
  return filteredSubtitleArray;
}
