import { PrismaClient } from "@prisma/client";
import { getSubtitlesForVideo } from "./utils/youtube-subtitles-client";

export async function importYoutubeSubtitles(prisma: PrismaClient) {
  const videos = await prisma.youtubeVideo.findMany({
    where: {
      NOT: {
        show: null,
      },
    },
  });

  for (const video of videos) {
    const subtitleCount = await prisma.subtitle.count({
      where: {
        videoId: video.id,
      },
    });

    if (subtitleCount === 0) {
      try {
        const subtitles = await getSubtitlesForVideo(video.id);
        console.log(video.id, subtitles.length);

        for (const subtitle of subtitles) {
          await prisma.subtitle.create({
            data: {
              text: subtitle[0],
              startTime: subtitle[1],
              endTime: subtitle[2],
              videoId: video.id,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
