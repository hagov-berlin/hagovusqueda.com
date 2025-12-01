import prisma from "../db";

export type VideoWithSubtitles = Awaited<ReturnType<typeof getVideosWithSubtitles>>[number];

export default function getVideosWithSubtitles(videoIds: number[]) {
  return prisma.youtubeVideo.findMany({
    where: {
      id: { in: videoIds },
    },
    include: {
      subtitles: { orderBy: { order: "asc" }, omit: { id: true, videoId: true } },
      show: { select: { name: true, slug: true } },
      channel: { select: { name: true, slug: true, youtubeId: true } },
    },
    omit: {
      id: true,
      showId: true,
      channelId: true,
      ignored: true,
    },
    orderBy: { date: "desc" },
  });
}
