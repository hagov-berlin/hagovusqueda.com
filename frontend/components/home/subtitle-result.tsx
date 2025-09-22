import { useState } from "react";
import { Subtitle } from "@/data/types";
import styles from "./subtitle-result.module.css";
import Button from "./button";

function secondsToTime(milisecondsNumber: number) {
  const cleanedSeconds = Math.max(0, milisecondsNumber / 1000);
  const hoursString = Math.floor(cleanedSeconds / 60 / 60)
    .toString()
    .padStart(2, "0");
  const minutesString = Math.floor((cleanedSeconds % (60 * 60)) / 60)
    .toString()
    .padStart(2, "0");
  const secondsString = Math.floor(cleanedSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${hoursString}:${minutesString}:${secondsString}`;
}

type YoutubeIframeProps = {
  videoId: string;
  start: number;
};

function YoutubeIframe(props: YoutubeIframeProps) {
  return (
    <iframe
      className={styles.resultIframe}
      width="640"
      height="360"
      allow="autoplay"
      src={`https://www.youtube.com/embed/${props.videoId}?start=${props.start}&autoplay=1&`}
      frameBorder="0"
    ></iframe>
  );
}

type SubtitleProps = {
  videoId: string;
  subtitle: Subtitle;
};

export function SubtitleResult(props: SubtitleProps) {
  const [expanded, setExpanded] = useState(false);

  const startSeconds = Math.round(props.subtitle.startTimeMs / 1000) - 2;
  return (
    <div
      className={`${styles.subtitleMatch} ${expanded ? styles.subtitleMatchExpanded : ""}`}
      onClick={expanded ? undefined : () => setExpanded(true)}
    >
      <div className={styles.subtitleMatchHeaderContainer}>
        <div className={styles.subtitleMatchHeader}>
          <span className={styles.subtitleTime}>{secondsToTime(props.subtitle.startTimeMs)}</span>
          <span className={styles.subtitleText}>{props.subtitle.text}</span>
        </div>
        {expanded ? null : <Button>VER</Button>}
      </div>
      {expanded && <YoutubeIframe videoId={props.videoId} start={startSeconds} />}
    </div>
  );
}
