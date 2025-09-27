import type { Prisma } from "@prisma/client";
import prisma from "./db";
import { FastifyRequest } from "fastify";

const include: Prisma.YoutubeChannelInclude = {
  shows: {
    orderBy: {
      slug: "asc",
    },
    select: {
      name: true,
      slug: true,
    },
  },
};

const omit: Prisma.YoutubeChannelOmit = {
  id: true,
};

export async function channels(req: FastifyRequest) {
  return prisma.youtubeChannel.findMany({
    include,
    omit,
  });
}

export async function channel(req: FastifyRequest) {
  const { slug } = req.params as Record<string, string>;
  return prisma.youtubeChannel.findFirst({
    where: { slug },
    include,
    omit,
  });
}
