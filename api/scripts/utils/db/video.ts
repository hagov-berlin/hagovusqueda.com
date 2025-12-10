import { YoutubePlaylist } from "@prisma/client";
import slugify from "slugify";
import prismaClient from "./prisma-client";
import { YoutubeVideoFromPlaylist } from "../youtube-api/get-videos-from-playlist";
import logger from "../logger";

export async function videoAlreadyExists(youtubeId: string) {
  return !!(await prismaClient.youtubeVideo.findFirst({
    where: { youtubeId: youtubeId },
  }));
}

export async function upsertVideo(playlist: YoutubePlaylist, video: YoutubeVideoFromPlaylist) {
  const existingVideo = await prismaClient.youtubeVideo.findFirst({
    where: {
      youtubeId: video.youtubeId,
    },
  });

  if (existingVideo && existingVideo.durationSec !== video.duration) {
    logger.info(
      `Deleting existing video ${video.youtubeId} before upsert because the duration changed`
    );
    await deleteVideo(video.youtubeId);
  }

  const payload = {
    youtubeId: video.youtubeId,
    title: video.title,
    slug: slugify(video.title.replace(/[\|\$]/g, ""), {
      lower: true,
      strict: true,
      locale: "es",
    }),
    date: new Date(video.date),
    durationSec: video.duration,
  };
  await prismaClient.youtubeVideo.upsert({
    where: { youtubeId: video.youtubeId },
    update: payload,
    create: {
      ...payload,
      channelId: playlist.channelId ? playlist.channelId : undefined,
      showId: playlist.showId ? playlist.showId : undefined,
      ignored: playlist.showId ? false : undefined,
      has_yt_subs: true,
    },
  });
}

export async function deleteVideo(youtubeId: string) {
  // TODO: delete subs file from s3?
  await prismaClient.transcript.deleteMany({
    where: { video: { youtubeId } },
  });
  await prismaClient.subtitle.deleteMany({
    where: { video: { youtubeId } },
  });
  await prismaClient.youtubeVideo.deleteMany({
    where: { youtubeId },
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
    skip: total > 1 && total > limit ? Math.floor(Math.random() * (total - limit)) : 0,
  });
}

export async function markVideoAsNotHavingAutoSubs(youtubeId: string) {
  await prismaClient.youtubeVideo.update({
    where: { youtubeId },
    data: { has_yt_subs: false },
  });
}
