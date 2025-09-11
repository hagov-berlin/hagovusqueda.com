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

  console.log(`Found ${videos.length} videos`);

  for (const video of videos) {
    const subtitleCount = await prisma.subtitle.count({
      where: {
        videoId: video.id,
      },
    });

    const missingTranscript = !video.transcript || video.transcript.length === 0;
    const missingSubtitles = subtitleCount === 0;
    const shouldBeUpdated = missingTranscript || missingSubtitles;

    if (!shouldBeUpdated) continue;

    const subtitles = await getSubtitlesForVideo(video.id);

    if (missingTranscript && subtitles.length > 0) {
      console.log("Updating transcript", video.id);
      await prisma.youtubeVideo.update({
        where: {
          id: video.id,
        },
        data: {
          transcript: subtitles.map((subtitle) => subtitle[0]).join(" "),
        },
      });
    }

    if (missingSubtitles && subtitles.length > 0) {
      try {
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
