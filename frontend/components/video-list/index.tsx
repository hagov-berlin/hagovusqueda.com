import { ReactNode } from "react";
import type { Pagination, Video } from "@/data/types";
import VideoResult from "./video-result";
import styles from "./index.module.css";
import PaginationLinks from "./pagination-links";
import Container from "../container";

type VideoListProps = {
  videos: Video[];
  title?: ReactNode;
  pagination?: Pagination;
  videoLinks?: boolean;
};

export default function VideoList(props: VideoListProps) {
  const { videos, title, pagination, videoLinks } = props;
  return (
    <Container>
      <div className={styles.results}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {videos?.map((result) => (
          <VideoResult key={result.youtubeId} result={result} videoLink={videoLinks} />
        ))}
        {pagination ? <PaginationLinks pagination={pagination} /> : null}
      </div>
    </Container>
  );
}
