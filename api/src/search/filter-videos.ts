import { buildTextRegex } from "./utils";
import { Transcript } from "@prisma/client";
import { FastifyBaseLogger } from "fastify";
import { Subtitle } from "../../scripts/utils/srt-to-array";

function mergeSubtitles(subtitles: Subtitle[]) {
  return [
    subtitles.reduce<string>((accum, sub) => {
      return accum + (sub[0] || "") + " ";
    }, ""),
    subtitles[0]?.[1] || 0,
    subtitles[subtitles.length - 1]?.[2] || 0,
  ];
}

function findSubtitle(match: RegExpExecArray, transcript: Transcript) {
  const textIndex = match.index;
  const matchLength = match[0].length;
  const subtitles: Subtitle[] = (transcript.subtitles as Subtitle[]).filter(
    (subtitle) =>
      (subtitle[3] <= textIndex && textIndex <= subtitle[4]) ||
      (textIndex <= subtitle[3] && subtitle[3] <= textIndex + matchLength) ||
      (textIndex <= subtitle[4] && subtitle[4] <= textIndex + matchLength)
  );
  return mergeSubtitles(subtitles);
}

function filterSubtitles(transcript: Transcript, q: string) {
  if (!transcript) return [];
  const searchRegex = buildTextRegex(q);
  const matches = [...transcript.text.matchAll(searchRegex)];
  return matches
    .map((match) => findSubtitle(match, transcript))
    .filter((sub, index, allSubs) => {
      return sub[0] && !allSubs.slice(index + 1).find((nextSub) => nextSub[0] === sub[0]);
    });
}

type VideoWithTranscripts = {
  youtubeId: string;
  transcripts?: Transcript[];
};

export function filterVideos(videos: VideoWithTranscripts[], q: string, logger: FastifyBaseLogger) {
  const filteredVideos = videos
    .map((video) => {
      const subtitles = filterSubtitles(video.transcripts[0], q);
      delete video.transcripts;
      return {
        ...video,
        subtitles,
      };
    })
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
