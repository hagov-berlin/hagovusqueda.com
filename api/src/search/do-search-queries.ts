import prisma from "../db";
import { getShowIds } from "./utils";

type QueryResult = {
  total: BigInt;
  results: number[];
};

function buildQuery(q: string, showIds: number[], page: number, perPage: number) {
  const params: [string, number[]?] = [`"${q}"`];

  let showsFilter = "";
  if (showIds.length > 0) {
    showsFilter = ` AND t."showId" = ANY($2::int[])`;
    params.push(showIds);
  }

  const sqlQuery = `
    WITH filtered AS (
      SELECT
        t."videoId",
        v."date"
      FROM "Transcript" t
      INNER JOIN "YoutubeVideo" v ON t."videoId" = v."id"
      WHERE t.search_vector @@ phraseto_tsquery('simple', $1)
      ${showsFilter}
    ),
    paginated AS (
      SELECT *
      FROM filtered
      ORDER BY "date" DESC
      LIMIT ${perPage}
      OFFSET ${(page - 1) * perPage}
    )
    SELECT
      (SELECT COUNT(*) FROM filtered) AS total,
      json_agg(paginated."videoId") AS results
    FROM paginated;
  `;
  return { sqlQuery, params };
}

export default async function doSearchQueries(
  q: string,
  showSlugs: string[],
  channelSlug: string,
  page: number = 1,
  perPage: number = 10
) {
  const showIds = await getShowIds(showSlugs, channelSlug);

  const { sqlQuery, params } = buildQuery(q, showIds, page, perPage);
  const queryResults: QueryResult[] = await prisma.$queryRawUnsafe<any[]>(sqlQuery, ...params);
  const [{ results, total }] = queryResults;

  return { results, totalCount: Number(total) };
}
