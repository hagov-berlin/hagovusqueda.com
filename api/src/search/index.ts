import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db";
import { Show } from "@prisma/client";
import { parseQuery } from "../utils";
import getVideoIdsFromPostgresTextSearch from "./get-video-ids-from-postgres-text-search";
import getVideosWithSubtitles, { VideoWithSubtitles } from "./get-videos-with-subtitles";
import { filterVideos } from "./filter-videos";

function splitIntoChunks<T>(list: T[], chunkSize: number = 50): T[][] {
  const output: T[][] = [];
  for (let i = 0, len = list.length; i < len; i += chunkSize)
    output.push(list.slice(i, i + chunkSize));
  return output;
}

export default async function search(req: FastifyRequest, reply: FastifyReply) {
  const { q, show: showSlugs, channel: channelSlug } = parseQuery(req);

  if (!q) {
    return reply.status(400).send({ error: "Missing query param 'q'" });
  }

  const startTime = new Date().getTime();

  let shows: Show[] = [];
  if (showSlugs.length > 0) {
    shows = await prisma.show.findMany({ where: { slug: { in: showSlugs } } });
  } else if (channelSlug) {
    shows = await prisma.show.findMany({
      where: { channel: { slug: channelSlug } },
    });
  }
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
    if (results.length > 50 || subtitleResults > 500) {
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
