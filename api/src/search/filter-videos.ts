import buildTextRegex from "./build-text-regex";
import { VideoWithSubtitles } from "./get-videos-with-subtitles";

function filterSubtitles<T extends { text: string }>(
  subtitles: T[],
  textMatcher: (text: string) => boolean
): T[] {
  const matches = subtitles.filter((subtitle, index) => {
    const subtitleText = subtitle.text;
    const subtitleMatches = textMatcher(subtitleText);
    if (subtitleMatches) return true;

    const nextSubtitleText = subtitles[index + 1]?.text;
    if (!nextSubtitleText) return false;

    const nextSubtitleMatches = textMatcher(nextSubtitleText);
    if (nextSubtitleMatches) return false;

    const thisAndNextSubtitleMatches = textMatcher(`${subtitleText} ${nextSubtitleText}`);
    return thisAndNextSubtitleMatches;
  });
  return matches;
}

export function filterVideos(videos: VideoWithSubtitles[], q: string) {
  const textMatcher = buildTextRegex(q);
  return videos
    .map((video) => ({
      ...video,
      subtitles: filterSubtitles(video.subtitles, textMatcher),
    }))
    .filter((video) => video.subtitles.length > 0);
}
