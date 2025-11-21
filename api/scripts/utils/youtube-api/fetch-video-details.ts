import logger from "../logger";

export type VideoDetail = {
  id: string;
  contentDetails: { duration: string };
  liveStreamingDetails?: {
    actualStartTime?: string;
  };
};

export default async function fetchVideoDetails(ids: string[]) {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const detailUrl = `https://www.googleapis.com/youtube/v3/videos?key=${youtubeApiKey}&id=${ids.join(
    ","
  )}&part=contentDetails,liveStreamingDetails`;
  logger.debug(`Requesting ${detailUrl}`);
  const detailResponse = await fetch(detailUrl);
  const detailJson: { items: VideoDetail[] } = await detailResponse.json();
  return detailJson;
}
