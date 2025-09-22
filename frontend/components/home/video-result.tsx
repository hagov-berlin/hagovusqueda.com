/* eslint-disable @next/next/no-img-element */
import type { Result } from "@/data/types";
import styles from "./video-result.module.css";
import { SubtitleResult } from "./subtitle-result";

function parseDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

type ResultProps = {
  result: Result;
};

export default function VideoResult(props: ResultProps) {
  const { result } = props;
  return (
    <div className={styles.videoResult}>
      <div className={styles.videoResultHeader}>
        <div className={styles.videoResultTitleContainer}>
          <div>
            <h3 className={styles.videoResultTitle}>{result.title || "Missing title"}</h3>{" "}
            <span>{result.date ? parseDate(result.date) : "Missing date"}</span>
          </div>
        </div>
        <img
          className={styles.videoThumbnail}
          src={`https://i.ytimg.com/vi/${result.youtubeId}/mqdefault.jpg`}
          alt={result.title}
        />
      </div>
      {result.subtitles.map((subtitle, index) => (
        <SubtitleResult key={index} videoId={result.youtubeId} subtitle={subtitle} />
      ))}
    </div>
  );
}
