import { ReactNode } from "react";
import type { Pagination, Video } from "@/data/types";
import VideoResult from "./video-result";
import styles from "./index.module.css";
import PaginationLinks from "./pagination-links";

type VideoListProps = {
  videos: Video[];
  title?: ReactNode;
  pagination?: Pagination;
};

export default function VideoList(props: VideoListProps) {
  const { videos, title, pagination } = props;
  return (
    <div className={styles.results}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      {videos?.map((result) => (
        <VideoResult key={result.youtubeId} result={result} />
      ))}
      {pagination ? <PaginationLinks pagination={pagination} /> : null}
    </div>
  );
}
