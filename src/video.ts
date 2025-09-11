import { Prisma } from "@prisma/client";
import prisma from "./db";
import { FastifyRequest } from "fastify";
import { parseQuery } from "./utils";

export async function videos(req: FastifyRequest) {
  const { page, show } = parseQuery(req);
  const filters: Prisma.YoutubeVideoWhereInput = {};
  if (show.length == 1) {
    filters.show = show[0];
  } else if (show.length > 1) {
    filters.show = { in: show };
  }

  // TODO: Date filters

  return prisma.youtubeVideo
    .paginate({
      where: {
        NOT: {
          show: null,
        },
        ...filters,
      },
      select: {
        id: true,
        title: true,
        show: true,
        date: true,
        duration: true,
        transcript: false,
      },
      orderBy: {
        date: "desc",
      },
    })
    .withPages({ limit: 20, page });
}

export async function video(req: FastifyRequest) {
  const { id } = req.params as Record<string, string>;
  return await prisma.youtubeVideo.findUnique({
    where: { id },
    include: { subtitles: true },
  });
}
