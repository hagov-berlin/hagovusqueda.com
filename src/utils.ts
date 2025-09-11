import { FastifyRequest } from "fastify";

export function parseQuery(req: FastifyRequest) {
  const query = req.query as Record<string, string | undefined>;

  const { q, show: showString, page: pageString } = query;

  const page = pageString ? parseInt(pageString) : 1;

  let show: string[] = [];
  if (showString) {
    show = showString
      .split(",")
      .slice(0, 20)
      .map((s) => s.trim())
      .filter((s) => s.length < 20);
  }

  return { q, page, show };
}
