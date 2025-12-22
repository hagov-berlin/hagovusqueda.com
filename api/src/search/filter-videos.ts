import { buildTextRegex } from "./utils";
import { VideoWithSubtitles } from "./get-videos-with-subtitles";
import { FastifyBaseLogger } from "fastify";
import { Subtitle } from "../../scripts/utils/srt-to-array";

function filterSubtitles(
  subtitles: Subtitle[],
  textMatcher: (text: string) => boolean
): Subtitle[] {
  const matches = subtitles.filter((subtitle, index) => {
    const subtitleText = subtitle[0];
    const subtitleMatches = textMatcher(subtitleText);
    if (subtitleMatches) return true;

    const nextSubtitleText = subtitles[index + 1]?.[0];
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
      subtitles: filterSubtitles(
        (video.transcripts[0]?.subtitles as Subtitle[]) || [],
        textMatcher
      ),
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
