import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "./db";

export default async function search(req: FastifyRequest, reply: FastifyReply) {
  const urlQueryParams = req.query as Record<string, string>;
  const { show, q } = urlQueryParams;

  if (!q) {
    return reply.status(400).send({ error: "Missing query param 'q'" });
  }

  let sqlQuery = `
    SELECT v.id , v.title, v.show, v.date, v.duration
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
  sqlQuery += ` ORDER BY v.date DESC LIMIT 50;`;

  const results = await prisma.$queryRawUnsafe<any[]>(sqlQuery, ...params);

  return { results };
}
