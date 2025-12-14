import { FastifyReply, FastifyRequest } from "fastify";
import { parseQuery } from "../utils";
import getVideosWithSubtitles from "./get-videos-with-subtitles";
import doSearchQueries from "./do-search-queries";
import { filterVideos } from "./filter-videos";
import { getPagination } from "./utils";

export default async function search(req: FastifyRequest, reply: FastifyReply) {
  const { q, show: showSlugs, channel: channelSlug, page } = parseQuery(req);

  if (!q) {
    return reply.status(400).send({ error: "Missing query param 'q'" });
  }

  const startTime = new Date().getTime();

  const { results: videoIds, totalCount } = await doSearchQueries(
    q,
    showSlugs,
    channelSlug,
    page,
    10
  );
  const pagination = getPagination(page, totalCount);

  type Result = ReturnType<typeof filterVideos>[number];

  let results: Result[] = [];

  if (videoIds && videoIds.length > 0) {
    const fullVideos = await getVideosWithSubtitles(videoIds);
    results = filterVideos(fullVideos, q, req.log);
  }

  const ms = new Date().getTime() - startTime;
  req.log.info({
    msg: "Search",
    q,
    show: showSlugs,
    videoResults: totalCount,
    page,
    pageResults: results.length,
    ms,
  });

  return [results, pagination];
}
