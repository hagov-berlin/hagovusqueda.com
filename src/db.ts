import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";

const prisma = new PrismaClient().$extends(
  pagination({
    pages: {
      includePageCount: true,
    },
  })
);

export default prisma;
