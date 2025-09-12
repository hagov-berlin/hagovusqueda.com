import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "./db";
import { Subtitle, YoutubeVideo } from "@prisma/client";
import { parseQuery } from "./utils";

async function getVideoIdsFromPostgresTextSearch(
  q: string,
  showIds: number[],
  limit: number = 1000
) {
  let sqlQuery = `
    SELECT v."youtubeId"
    FROM "YoutubeVideo" v
    WHERE to_tsvector('spanish', v.transcript) @@ plainto_tsquery('spanish', $1)
  `;

  const params: [string, number[]?] = [q];
  let paramIndex = 2;

  if (showIds.length > 0) {
    sqlQuery += ` AND v."showId" = ANY($${paramIndex}::int[])`;
    params.push(showIds);
    paramIndex++;
    console.log({ showIds });
  }
  sqlQuery += `LIMIT ${limit};`;

  const results: { youtubeId: string }[] = await prisma.$queryRawUnsafe<any[]>(sqlQuery, ...params);
  return results.map((result) => result.youtubeId);
}

function getVideosWithSubtitles(videoIds: string[]) {
  return prisma.youtubeVideo.findMany({
    where: {
      youtubeId: { in: videoIds },
    },
    include: {
      subtitles: { orderBy: { order: "asc" } },
      show: { select: { name: true, slug: true } },
      channel: { select: { name: true, slug: true } },
    },
    omit: {
      transcript: true,
      id: true,
      showId: true,
      channelId: true,
      ignored: true,
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

type VideoWithSubtitles = Awaited<ReturnType<typeof getVideosWithSubtitles>>[number];

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
  const { q, show: showSlugs } = parseQuery(req);

  if (!q) {
    return reply.status(400).send({ error: "Missing query param 'q'" });
  }

  const startTime = new Date().getTime();

  const shows = await prisma.show.findMany({ where: { slug: { in: showSlugs } } });
  const showIds = shows.map((show) => show.id);

  const videoIds = await getVideoIdsFromPostgresTextSearch(q, showIds);
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
  req.log.info({
    msg: "Search",
    q,
    show: showSlugs,
    videoResults: results.length,
    subtitleResults,
    ms,
  });

  return { results, resultsCapped };
}
