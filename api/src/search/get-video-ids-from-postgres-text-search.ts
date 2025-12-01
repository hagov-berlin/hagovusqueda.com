import prisma from "../db";

export default async function getVideoIdsFromPostgresTextSearch(
  q: string,
  showIds: number[],
  limit: number = 1000
) {
  let sqlQuery = `
    SELECT t."videoId"
    FROM "Transcript" t
    WHERE to_tsvector('spanish', t.text) @@ plainto_tsquery('spanish', $1)
  `;

  const params: [string, number[]?] = [q];

  if (showIds.length > 0) {
    sqlQuery += ` AND t."showId" = ANY($2::int[])`;
    params.push(showIds);
  }
  // sqlQuery += ` ORDER BY v.date DESC LIMIT ${limit};`;
  sqlQuery += ` LIMIT ${limit};`;

  const results: { videoId: number }[] = await prisma.$queryRawUnsafe<any[]>(sqlQuery, ...params);
  return results.map((result) => result.videoId);
}
