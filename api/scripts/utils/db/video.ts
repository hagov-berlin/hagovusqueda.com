import { YoutubePlaylist } from "@prisma/client";
import slugify from "slugify";
import prismaClient from "./prisma-client";
import { YoutubeVideoFromPlaylist } from "../youtube-api/get-videos-from-playlist";

export async function videoAlreadyExists(videoId: string) {
  return !!(await prismaClient.youtubeVideo.findFirst({
    where: { youtubeId: videoId },
  }));
}

export async function upsertVideo(playlist: YoutubePlaylist, video: YoutubeVideoFromPlaylist) {
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
  await prismaClient.youtubeVideo.upsert({
    where: { youtubeId: video.videoId },
    update: payload,
    create: payload,
  });
}

export async function deleteVideo(videoId: string) {
  // TODO: also remove transcript and subtitles if they already exist
  await prismaClient.youtubeVideo.delete({
    where: { youtubeId: videoId },
  });
}

export async function getVideoWithMissingSubtitles(limit: number) {
  const total = await prismaClient.youtubeVideo.count({
    where: {
      transcripts: { none: {} },
      durationSec: { gt: 0 },
    },
  });

  return prismaClient.youtubeVideo.findMany({
    where: {
      transcripts: { none: {} },
      durationSec: { gt: 0 },
    },
    orderBy: {
      date: "desc",
    },
    take: limit,
  });
}
