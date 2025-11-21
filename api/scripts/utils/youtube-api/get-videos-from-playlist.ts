import { YoutubePlaylist } from "@prisma/client";
import logger from "../logger";
import fetchPlaylistItems from "./fetch-playlist-items";
import fetchVideoDetails from "./fetch-video-details";
import mergeVideoInfo from "./merge-video-info";

export type YoutubeVideoFromPlaylist = {
  videoId: string;
  title: string;
  date: string;
  duration: number;
  private: boolean;
};

export default async function getVideosFromPlaylist(playlist: YoutubePlaylist, fetchLimit: number) {
  let nextPageToken: string | null;
  let videos: YoutubeVideoFromPlaylist[] = [];
  do {
    logger.debug(`Requesting playlist ${playlist.youtubeId}`);
    const playlistResponse = await fetchPlaylistItems(playlist.youtubeId, nextPageToken);
    logger.debug(`Got ${playlistResponse.items.length} results from youtube playlist endpoint`);
    nextPageToken = playlistResponse.nextPageToken;

    const ids = playlistResponse.items.map((item) => item.snippet.resourceId.videoId);
    const detailResponse = await fetchVideoDetails(ids);
    logger.debug(`Got ${detailResponse.items.length} results from youtube detail endpoint`);

    const newVideos = mergeVideoInfo(playlistResponse.items, detailResponse.items);
    videos = [...videos, ...newVideos];
  } while (videos.length < fetchLimit && nextPageToken);
  return videos;
}
