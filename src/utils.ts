import { FastifyRequest } from "fastify";

export function parseQuery(req: FastifyRequest) {
  const query = req.query as Record<string, string | undefined>;
  const { q, show, page: pageString } = query;
  const page = pageString ? parseInt(pageString) : 1;

  return { q, page, show };
}
