import { Prisma } from "@prisma/client";
import prisma from "./db";
import { FastifyRequest } from "fastify";
import { parseQuery } from "./utils";

export async function videos(req: FastifyRequest) {
  const { page, show, channel } = parseQuery(req);

  const filters: Prisma.YoutubeVideoWhereInput = {
    ignored: false,
  };

  if (show.length == 1) {
    filters.show = { slug: show[0] };
  } else if (show.length > 1) {
    filters.show = { slug: { in: show } };
  }

  if (channel) {
    filters.channel = { slug: channel };
  }

  // TODO: Date filters

  return prisma.youtubeVideo
    .paginate({
      where: filters,
      include: {
        show: { select: { slug: true } },
        channel: { select: { slug: true } },
      },
      omit: {
        id: true,
        showId: true,
        channelId: true,
        transcript: true,
        ignored: true,
      },
      orderBy: {
        date: "desc",
      },
    })
    .withPages({ limit: 20, page });
}

export async function video(req: FastifyRequest) {
  const { id } = req.params as Record<string, string>;
  return await prisma.youtubeVideo.findFirst({
    where: { youtubeId: id },
    include: {
      subtitles: { orderBy: { order: "asc" } },
      show: { select: { name: true, slug: true } },
      channel: { select: { name: true, slug: true } },
    },
    omit: {
      id: true,
      showId: true,
      channelId: true,
      ignored: true,
    },
  });
}
