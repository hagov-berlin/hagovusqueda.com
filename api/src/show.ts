import type { Prisma } from "@prisma/client";
import prisma from "./db";
import { FastifyRequest } from "fastify";

const include: Prisma.ShowInclude = {
  channel: {
    omit: {
      id: true,
    },
  },
};

const omit: Prisma.ShowOmit = {
  id: true,
  channelId: true,
};

export function shows() {
  return prisma.show.findMany({
    include,
    omit,
  });
}

export function show(req: FastifyRequest) {
  const { slug } = req.params as Record<string, string>;
  return prisma.show.findFirst({
    where: { slug },
    include,
    omit,
  });
}
