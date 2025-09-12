import { PrismaClient } from "@prisma/client";
import { request } from "./utils/youtube-api-client";
import slugify from "slugify";

const channelId = "UC6pJGaMdx5Ter_8zYbLoRgA"; // Blender Channel ID
const blenderPlaylist = channelId.replace(/^UC/, "UU");

export async function importBlenderYoutubeVideos(prisma: PrismaClient, limit = 50) {
  const firstResponse = await request(blenderPlaylist);
  let videos = firstResponse.videos;
  let nextPageToken = firstResponse.nextPageToken;
  while (videos.length < limit) {
    const nextResponse = await request(blenderPlaylist, nextPageToken);
    (videos = [...videos, ...nextResponse.videos]), (nextPageToken = nextResponse.nextPageToken);
  }

  const blenderChannel = await prisma.youtubeChannel.findFirst({
    where: {
      slug: "blender",
    },
  });

  for (const video of videos) {
    // Si el video no existe, crearlo primero
    const payload = {
      youtubeId: video.videoId,
      title: video.title,
      slug: slugify(video.title.replace(/[\|\$]/g, ""), {
        lower: true,
        strict: true,
        locale: "es",
      }),
      date: new Date(video.date),
      durationSec: video.duration,
      channelId: blenderChannel?.id,
    };
    await prisma.youtubeVideo.upsert({
      where: { youtubeId: video.videoId },
      update: payload,
      create: payload,
    });
  }
}
