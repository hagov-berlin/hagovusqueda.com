import logger from "../logger";
import { PlaylistItem } from "./fetch-playlist-items";
import { VideoDetail } from "./fetch-video-details";
import { getDurationInSeconds, isValidDuration } from "./utils";

export default function mergeVideoInfo(
  videosFromPlaylist: PlaylistItem[],
  videoDetails: VideoDetail[]
) {
  return videosFromPlaylist.map((item) => {
    const detail = videoDetails.find(
      (detailItem) => detailItem.id === item.snippet.resourceId.videoId
    );
    if (!detail && item.contentDetails.videoPublishedAt) {
      logger.warn("Missing detail for", item.snippet.resourceId.videoId);
    }
    const durationString = detail?.contentDetails.duration;
    return {
      youtubeId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date: detail?.liveStreamingDetails?.actualStartTime || item.snippet.publishedAt,
      duration: isValidDuration(durationString) ? getDurationInSeconds(durationString) : 0,
      private: !detail && !item.contentDetails.videoPublishedAt,
    };
  });
}
