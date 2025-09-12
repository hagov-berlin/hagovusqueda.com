import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "./db";
import { Subtitle, YoutubeVideo } from "@prisma/client";
import { parseQuery } from "./utils";

async function getVideoIdsFromPostgresTextSearch(q: string, show: string[], limit: number = 1000) {
  let sqlQuery = `
    SELECT v.id
    FROM "YoutubeVideo" v
    WHERE to_tsvector('spanish', v.transcript) @@ plainto_tsquery('spanish', $1)
  `;

  const params: [string, string[]?] = [q];
  let paramIndex = 2;

  if (show.length > 0) {
    sqlQuery += ` AND v.show = ANY($${paramIndex}::text[])`;
    params.push(show);
    paramIndex++;
  }
  sqlQuery += `LIMIT ${limit};`;

  const results: { id: string }[] = await prisma.$queryRawUnsafe<any[]>(sqlQuery, ...params);
  return results.map((result) => result.id);
}

function getVideosWithSubtitles(videoIds: string[]) {
  return prisma.youtubeVideo.findMany({
    where: {
      id: { in: videoIds },
    },
    include: { subtitles: true },
    omit: {
      transcript: true,
    },
    orderBy: { date: "desc" },
  });
}

function normalizeText(text: string, ignoreAccents: boolean) {
  if (ignoreAccents) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return text;
}

function buildRegex(q: string, ignoreAccents: boolean = true, matchWholeWords: boolean = false) {
  const normalizedSearchTerm = normalizeText(q, ignoreAccents);
  const regexString = matchWholeWords ? `\\b${normalizedSearchTerm}\\b` : normalizedSearchTerm;
  const searchRegex = new RegExp(regexString, "i");
  return function testRegex(textToTest: string) {
    const normalizedTextToTest = normalizeText(textToTest, ignoreAccents);
    return searchRegex.test(normalizedTextToTest);
  };
}

type VideoWithSubtitles = Omit<YoutubeVideo, "transcript"> & {
  subtitles: Subtitle[];
};

function filterSubtitles(subtitles: Subtitle[], textMatcher: (text: string) => boolean) {
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

function filterVideos(videos: VideoWithSubtitles[], q: string) {
  const textMatcher = buildRegex(q);
  return videos
    .map((video) => ({
      ...video,
      subtitles: filterSubtitles(video.subtitles, textMatcher),
    }))
    .filter((video) => video.subtitles.length > 0);
}

function splitIntoChunks<T>(list: T[], chunkSize: number = 50): T[][] {
  const output: T[][] = [];
  for (let i = 0, len = list.length; i < len; i += chunkSize)
    output.push(list.slice(i, i + chunkSize));
  return output;
}

export default async function search(req: FastifyRequest, reply: FastifyReply) {
  const { q, show } = parseQuery(req);

  if (!q) {
    return reply.status(400).send({ error: "Missing query param 'q'" });
  }

  const startTime = new Date().getTime();

  const videoIds = await getVideoIdsFromPostgresTextSearch(q, show);
  let results: VideoWithSubtitles[] = [];
  let subtitleResults = 0;
  let resultsCapped = false;
  for (const videoIdsChunk of splitIntoChunks(videoIds)) {
    const fullVideos = await getVideosWithSubtitles(videoIdsChunk);
    const newResults = filterVideos(fullVideos, q);
    results = [...results, ...newResults];
    subtitleResults = results.reduce((accum, result) => result.subtitles.length + accum, 0);
    if (results.length > 100 || subtitleResults > 1000) {
      resultsCapped = true;
      break;
    }
  }

  const ms = new Date().getTime() - startTime;
  req.log.info({ msg: "Search", q, show, videoResults: results.length, subtitleResults, ms });

  return { results, resultsCapped };
}
