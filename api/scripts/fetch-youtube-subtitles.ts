import { PrismaClient } from "@prisma/client";
import { importYoutubeSubtitles } from "./import-youtube-subtitles";
import logger from "./utils/logger";

const prisma = new PrismaClient();

class SubtitlesSyncJob {
  async start() {
    logger.info("Starting subtitles job");
    await importYoutubeSubtitles(prisma);
    logger.info("Subtitles job ended");
  }
}

async function main() {
  const subtitlesJob = new SubtitlesSyncJob();
  subtitlesJob.start();
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
