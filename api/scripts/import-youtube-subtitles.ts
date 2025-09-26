import { PrismaClient, YoutubeVideo } from "@prisma/client";
import { getSubtitlesForVideo, Subtitle } from "./utils/youtube-subtitles-client";

async function checkVideo(prisma: PrismaClient, video: YoutubeVideo) {
  const subtitleCount = await prisma.subtitle.count({
    where: {
      videoId: video.id,
    },
  });
  const missingTranscript = !video.transcript || video.transcript.length === 0;
  const missingSubtitles = subtitleCount === 0;
  const shouldBeUpdated = missingTranscript || missingSubtitles;
  return {
    missingTranscript,
    missingSubtitles,
    shouldBeUpdated,
  };
}

async function getVideosThatShouldBeUpdated(prisma: PrismaClient) {
  const videos = await prisma.youtubeVideo.findMany({
    where: {
      ignored: false,
    },
    orderBy: {
      date: "desc",
    },
  });

  let videosThatShouldBeUpdated: YoutubeVideo[] = [];

  for (const video of videos) {
    const { shouldBeUpdated } = await checkVideo(prisma, video);
    if (shouldBeUpdated) {
      videosThatShouldBeUpdated.push(video);
    }
  }

  console.log(
    `Found ${videosThatShouldBeUpdated.length} videos without subtitles and/or transcript`
  );
  return videosThatShouldBeUpdated;
}

export async function importYoutubeSubtitles(prisma: PrismaClient) {
  const videos = await getVideosThatShouldBeUpdated(prisma);

  console.log(`Found ${videos.length} videos`);

  let count = 1;
  for (const video of videos) {
    console.log(`Video ${count} of ${videos.length}`);
    count += 1;
    const { missingTranscript, missingSubtitles } = await checkVideo(prisma, video);

    let subtitles: Subtitle[] = [];
    try {
      subtitles = await getSubtitlesForVideo(video.youtubeId);
    } catch (error) {
      console.error(error);
    }

    if (missingTranscript && subtitles.length > 0) {
      // console.log("Updating transcript", video.youtubeId);
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
        // console.log(video.id, subtitles.length);

        const data = subtitles.map((subtitle, index) => {
          return {
            text: subtitle[0],
            startTimeMs: subtitle[1],
            endTimeMs: subtitle[2],
            videoId: video.id,
            order: index,
          };
        });
        await prisma.subtitle.createMany({
          data,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
