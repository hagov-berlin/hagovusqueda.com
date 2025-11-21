import { PrismaClient } from "@prisma/client";
// import { importYoutubeSubtitles } from "./import-youtube-subtitles";
import logger from "./utils/logger";

const prisma = new PrismaClient();

async function main() {
  logger.info("Starting subtitles job");
  // await importYoutubeSubtitles(prisma);
  logger.info("Subtitles job ended");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
