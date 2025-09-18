import { Prisma } from "@prisma/client";
import prisma from "./db";
import { FastifyRequest } from "fastify";

export async function channels(req: FastifyRequest) {
  return prisma.youtubeChannel.findMany({
    include: {
      shows: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    omit: {
      id: true,
    },
  });
}
