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
  isSearchResultList?: boolean;
};

export default function VideoList(props: VideoListProps) {
  const { videos, title, pagination, videoLinks, isSearchResultList } = props;
  return (
    <Container>
      <div className={styles.results}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {videos?.map((result) => (
          <VideoResult key={result.youtubeId} result={result} videoLink={videoLinks} />
        ))}
        {pagination ? (
          <PaginationLinks pagination={pagination} isSearchResultList={isSearchResultList} />
        ) : null}
      </div>
    </Container>
  );
}
