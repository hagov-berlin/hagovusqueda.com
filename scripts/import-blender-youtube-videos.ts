import { PrismaClient, YoutubeVideo } from "@prisma/client";
import { request, getWholePlaylist } from "./utils/youtube-api-client";

const channelId = "UC6pJGaMdx5Ter_8zYbLoRgA"; // Blender Channel ID
const blenderPlaylist = channelId.replace(/^UC/, "UU");

export async function importBlenderYoutubeVideos(prisma: PrismaClient, limit = 200) {
  const firstResponse = await request(blenderPlaylist);
  let videos = firstResponse.videos;
  let nextPageToken = firstResponse.nextPageToken;
  while (videos.length < limit) {
    const nextResponse = await request(blenderPlaylist, nextPageToken);
    (videos = [...videos, ...nextResponse.videos]), (nextPageToken = nextResponse.nextPageToken);
  }

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
