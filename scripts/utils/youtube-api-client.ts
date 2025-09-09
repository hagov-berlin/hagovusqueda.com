import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const durationRegex = /PT((\d+)H)?((\d+)M)?((\d+)S)?/;

function isValidDuration(str: string) {
  return durationRegex.test(str) && str.length > 2;
}

function getDurationInSeconds(durationString: string) {
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  const match = durationString.match(durationRegex);
  if (match) {
    if (match[6]) {
      seconds = parseInt(match[6]);
    }
    if (match[4]) {
      minutes = parseInt(match[4]);
    }
    if (match[2]) {
      hours = parseInt(match[2]);
    }
  }
  return seconds + minutes * 60 + hours * 60 * 60;
}

type PlaylistItem = {
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
  };
};

type VideoDetail = {
  contentDetails: { duration: string };
  liveStreamingDetails?: {
    actualStartTime?: string;
  };
};

type YoutubeVideo = {
  videoId: string;
  title: string;
  date: string;
  duration: number;
};

const baseApiPath = "https://www.googleapis.com/youtube/v3";

export async function request(
  playlist: string,
  pageToken?: string
): Promise<{ videos: YoutubeVideo[]; nextPageToken: string }> {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  let url = `${baseApiPath}/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlist}&key=${youtubeApiKey}`;
  if (pageToken) {
    url = `${url}&pageToken=${pageToken}`;
  }
  const response = await fetch(url);
  const { items, nextPageToken } = await response.json();

  const ids = items.map((item: PlaylistItem) => item.snippet.resourceId.videoId).join(",");
  const detailUrl = `${baseApiPath}/videos?key=${youtubeApiKey}&id=${ids}&part=contentDetails,liveStreamingDetails`;
  const detailResponse = await fetch(detailUrl);
  const detailJson: { items: VideoDetail[] } = await detailResponse.json();

  return {
    nextPageToken,
    videos: items.map((item: PlaylistItem, index: number) => {
      const durationString = detailJson.items[index].contentDetails.duration;
      return {
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        date:
          detailJson.items[index].liveStreamingDetails?.actualStartTime || item.snippet.publishedAt,
        duration: isValidDuration(durationString) ? getDurationInSeconds(durationString) : 0,
      };
    }),
  };
}

export async function getWholePlaylist(playlistId: string, limit = 1000) {
  let count = 1;
  let allVideos: YoutubeVideo[] = [];
  console.log(`Requesting initial page ${count} for playlist ${playlistId}`);
  const { videos: newVideos, nextPageToken } = await request(playlistId);
  allVideos = [...allVideos, ...newVideos];
  let pageToken = nextPageToken;
  while (pageToken && allVideos.length < limit) {
    count += 1;
    console.log(`Requesting initial page ${count} ${pageToken}`);
    const { videos: newVideos, nextPageToken } = await request(playlistId, pageToken);
    allVideos = [...allVideos, ...newVideos];
    pageToken = nextPageToken;
  }
  return allVideos;
}
