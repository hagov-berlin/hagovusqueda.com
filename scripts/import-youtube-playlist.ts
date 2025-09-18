import { PrismaClient, YoutubePlaylist } from "@prisma/client";
import { request } from "./utils/youtube-api-client";
import slugify from "slugify";

export async function importYoutubePlaylist(
  prisma: PrismaClient,
  playlist: YoutubePlaylist,
  limit: number
) {
  const firstResponse = await request(playlist.youtubeId);
  let videos = firstResponse.videos;
  let nextPageToken = firstResponse.nextPageToken;
  while (videos.length < limit && nextPageToken) {
    const nextResponse = await request(playlist.youtubeId, nextPageToken);
    (videos = [...videos, ...nextResponse.videos]), (nextPageToken = nextResponse.nextPageToken);
  }

  for (const video of videos) {
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
      channelId: playlist.channelId ? playlist.channelId : undefined,
      showId: playlist.showId ? playlist.showId : undefined,
      ignored: playlist.showId ? false : undefined,
    };
    await prisma.youtubeVideo.upsert({
      where: { youtubeId: video.videoId },
      update: payload,
      create: payload,
    });
  }
}
