import type { Prisma } from "@prisma/client";
import prisma from "./db";
import { FastifyRequest } from "fastify";
import { parseQuery } from "./utils";
import srtToArray from "../scripts/utils/srt-to-array";

const include: Prisma.YoutubeVideoInclude = {
  show: {
    select: {
      name: true,
      slug: true,
    },
  },
  channel: {
    select: {
      name: true,
      slug: true,
      youtubeId: true,
    },
  },
};

const omit: Prisma.YoutubeVideoOmit = {
  id: true,
  showId: true,
  channelId: true,
  ignored: true,
  has_yt_subs: true,
};

export async function videos(req: FastifyRequest) {
  const { page, show, channel, pageSize } = parseQuery(req);

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
      include,
      omit,
      orderBy: {
        date: "desc",
      },
    })
    .withPages({ limit: pageSize, page });
}

export async function video(req: FastifyRequest) {
  const { id } = req.params as Record<string, string>;
  const video = await prisma.youtubeVideo.findFirst({
    where: { youtubeId: id, ignored: false },
    include,
    omit,
  });

  const transcript = await prisma.transcript.findFirst({
    where: {
      video: { youtubeId: id },
    },
    select: {
      subtitles: true,
    },
  });
  const subtitles = transcript?.subtitles || [];

  return { ...video, subtitles };
}
