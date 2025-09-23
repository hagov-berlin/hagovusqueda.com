import { ReactNode } from "react";
import { Video } from "@/data/types";
import VideoResult from "./video-result";
import styles from "./index.module.css";

export default function VideoList(props: { videos: Video[]; title?: ReactNode }) {
  const { videos, title } = props;
  return (
    <div className={styles.results}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      {videos?.map((result) => (
        <VideoResult key={result.youtubeId} result={result} />
      ))}
    </div>
  );
}
