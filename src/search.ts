import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "./db";
import { Subtitle, YoutubeVideo } from "@prisma/client";
import { parseQuery } from "./utils";

async function getVideosAndTranscriptIndexes(q: string, show: string, options: { limit: number }) {
  let sqlQuery = `
    SELECT v.id, ts_headline(
      'spanish',
      v.transcript,
      plainto_tsquery('spanish', $1),
      'StartSel=<mark>, StopSel=</mark>, MaxWords=1000000, MinWords=0, ShortWord=3, HighlightAll=TRUE'
    ) as matches
    FROM "YoutubeVideo" v
    WHERE to_tsvector('spanish', v.transcript) @@ plainto_tsquery('spanish', $1)
  `;

  const params: [string, string[]?] = [q];
  let paramIndex = 2;

  if (show) {
    const shows = show
      .split(",")
      .slice(0, 20)
      .map((s) => s.trim())
      .filter((s) => s.length < 20);
    sqlQuery += ` AND v.show = ANY($${paramIndex}::text[])`;
    params.push(shows);
    paramIndex++;
  }
  sqlQuery += `LIMIT ${options.limit};`;

  const results: { id: string; matches: string }[] = await prisma.$queryRawUnsafe<any[]>(
    sqlQuery,
    ...params
  );
  return results.map((result) => {
    const indexes: number[] = [];
    let accumIndex = 0;
    result.matches
      .replace(/<\/mark>/g, "")
      .split("<mark>")
      .slice(0, -1)
      .forEach((preMatch) => {
        accumIndex += preMatch.length;
        indexes.push(accumIndex);
      });
    return { id: result.id, indexes };
  });
}

function removeUnimportantSubtitles(subtitles: Subtitle[], indexesOriginal: number[]) {
  const videoIndexes = [...indexesOriginal];
  let accumIndex = 0;
  let targetIndex = videoIndexes.shift();
  const filteredSubtitles = subtitles
    .sort((subA, subB) => subA.startTime - subB.startTime)
    .filter((subtitle) => {
      let weWantThisSubtitle = false;

      if (targetIndex > -1) {
        accumIndex += subtitle.text.length + 1;
        if (accumIndex > targetIndex) {
          weWantThisSubtitle = true;

          while (accumIndex > targetIndex && videoIndexes.length > 0) {
            targetIndex = videoIndexes.shift();
          }
          if (accumIndex > targetIndex && videoIndexes.length == 0) {
            targetIndex = -1;
          }
        }
      }

      return weWantThisSubtitle;
    });
  return filteredSubtitles;
}

export default async function search(req: FastifyRequest, reply: FastifyReply) {
  const { q, show } = parseQuery(req);

  if (!q) {
    return reply.status(400).send({ error: "Missing query param 'q'" });
  }

  const results = await getVideosAndTranscriptIndexes(q, show, { limit: 50 });
  const videoIds = results.map((result) => result.id);

  const fullVideos = await prisma.youtubeVideo.findMany({
    where: {
      id: { in: videoIds },
    },
    include: { subtitles: true },
    omit: {
      transcript: true,
    },
    orderBy: { date: "desc" },
  });

  const videosWithTheRightSubtitles = fullVideos.map((video) => {
    const videoIndexes = results.find((result) => result.id === video.id)?.indexes || [];
    return {
      ...video,
      videoIndexes,
      subtitles: removeUnimportantSubtitles(video.subtitles, videoIndexes),
    };
  });

  req.log.info({ msg: "Search", q, show, resultsLength: results.length });

  return { results: videosWithTheRightSubtitles, resultsCapped: false };
}
