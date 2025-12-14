import { buildTextRegex } from "./utils";
import { VideoWithSubtitles } from "./get-videos-with-subtitles";
import { FastifyBaseLogger } from "fastify";

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

export function filterVideos(videos: VideoWithSubtitles[], q: string, logger: FastifyBaseLogger) {
  const textMatcher = buildTextRegex(q);
  const filteredVideos = videos
    .map((video) => ({
      ...video,
      subtitles: filterSubtitles(video.subtitles, textMatcher),
    }))
    .filter((video) => video.subtitles.length > 0);
  if (videos.length !== filteredVideos.length) {
    logger.warn({
      msg: "Filtered videos missmatch",
      originalIds: videos.map((video) => video.youtubeId),
      filteredVideoIds: filteredVideos.map((video) => video.youtubeId),
    });
  }
  return filteredVideos;
}
