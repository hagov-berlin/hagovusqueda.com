import { YoutubePlaylist } from "@prisma/client";
import slugify from "slugify";
import prismaClient from "./prisma-client";
import { YoutubeVideoFromPlaylist } from "../youtube-api/get-videos-from-playlist";
import logger from "../logger";

export async function videoAlreadyExists(videoId: string) {
  return !!(await prismaClient.youtubeVideo.findFirst({
    where: { youtubeId: videoId },
  }));
}

export async function upsertVideo(playlist: YoutubePlaylist, video: YoutubeVideoFromPlaylist) {
  // TODO: if the duration changed then we need to delete stored (db and s3) subtitles for the video
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
    create: {
      ...payload,
      has_yt_subs: true,
    },
  });
}

export async function deleteVideo(videoId: string) {
  // TODO: also remove transcript and subtitles if they already exist
  await prismaClient.youtubeVideo.delete({
    where: { youtubeId: videoId },
  });
}

export async function getVideoWithMissingSubtitles(limit: number) {
  const where = {
    transcripts: { none: {} },
    durationSec: { gt: 0 },
    has_yt_subs: true,
  };
  const total = await prismaClient.youtubeVideo.count({ where });
  logger.debug(`Total videos without subs: ${total}`);
  return prismaClient.youtubeVideo.findMany({
    where,
    orderBy: {
      date: "desc",
    },
    take: limit,
    skip: total > 1 ? Math.floor(Math.random() * (total - limit)) : 0,
  });
}

export async function markVideoAsNotHavingAutoSubs(videoId: string) {
  await prismaClient.youtubeVideo.update({
    where: { youtubeId: videoId },
    data: { has_yt_subs: false },
  });
}
