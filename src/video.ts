import { Prisma } from "@prisma/client";
import prisma from "./db";
import { FastifyRequest } from "fastify";

export async function videos(req: FastifyRequest) {
  const query = req.query as Record<string, string>;
  const pageString = query.page;
  const page = pageString ? parseInt(pageString) : 1;

  const showString = query.show;
  const filters: Prisma.YoutubeVideoWhereInput = {};
  if (showString) {
    filters.show = showString;
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
