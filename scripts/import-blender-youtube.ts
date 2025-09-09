import { PrismaClient } from "@prisma/client";
import { request, getWholePlaylist } from "./utils/youtube-api-client";

const prisma = new PrismaClient();

const channelId = "UC6pJGaMdx5Ter_8zYbLoRgA"; // Blender Channel ID
const blenderPlaylist = channelId.replace(/^UC/, "UU");

async function main() {
  const { videos } = await request(blenderPlaylist);

  for (const video of videos) {
    // Si el video no existe, crearlo primero
    const payload = {
      id: video.videoId,
      title: video.title,
      duration: video.duration,
      date: new Date(video.date),
    };
    await prisma.youtubeVideo.upsert({
      where: { id: video.videoId },
      update: payload,
      create: payload,
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
