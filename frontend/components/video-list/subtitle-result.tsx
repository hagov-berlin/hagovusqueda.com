"use client";
import { useState } from "react";
import { Subtitle } from "@/data/types";
import styles from "./subtitle-result.module.css";
import Button from "../common/button";
import YoutubeIframe from "../video/youtube-iframe";
import { secondsToTime } from "../video/utils";

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
      {expanded && <YoutubeIframe videoId={props.videoId} start={startSeconds} autoplay />}
    </div>
  );
}
