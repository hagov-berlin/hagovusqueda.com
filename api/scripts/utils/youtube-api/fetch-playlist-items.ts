import logger from "../logger";

export type PlaylistItem = {
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
  };
  contentDetails: {
    videoPublishedAt: string;
  };
};

export default async function fetchPlaylistItems(playlist: string, pageToken?: string) {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlist}&key=${youtubeApiKey}`;
  if (pageToken) {
    url = `${url}&pageToken=${pageToken}`;
  }
  logger.debug(`Requesting ${url}`);
  const response = await fetch(url);
  const { items, nextPageToken }: { items: PlaylistItem[]; nextPageToken?: string } =
    await response.json();
  return { items, nextPageToken };
}
