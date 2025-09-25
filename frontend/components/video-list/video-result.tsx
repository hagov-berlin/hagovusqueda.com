/* eslint-disable @next/next/no-img-element */
import type { Video } from "@/data/types";
import styles from "./video-result.module.css";
import { SubtitleResult } from "./subtitle-result";
import Link from "next/link";
import { parseDate } from "../video/utils";
import Button from "../common/button";
import { ReactNode } from "react";

type ResultProps = {
  result: Video;
  videoLink?: boolean;
};

function VideoContainer(props: { videoLink?: boolean; video: Video; children: ReactNode }) {
  const { videoLink, video } = props;
  if (videoLink) {
    return (
      <Link href={`/videos/${video.slug}-${video.youtubeId}`} className={styles.videoResultHeader}>
        {props.children}
      </Link>
    );
  }
  return <div className={styles.videoResultHeader}>{props.children}</div>;
}

export default function VideoResult(props: ResultProps) {
  const { result, videoLink } = props;
  return (
    <div className={styles.videoResult}>
      <VideoContainer videoLink={videoLink} video={result}>
        <img
          className={styles.videoThumbnail}
          src={`https://i.ytimg.com/vi/${result.youtubeId}/mqdefault.jpg`}
          alt={result.title}
        />
        <div className={styles.videoResultTitleContainer}>
          <div>
            <h3 className={styles.videoResultTitle}>{result.title}</h3>{" "}
            <span className={styles.videoResultChannelDate}>
              {result.channel.name} {" - "} {parseDate(result.date)}
            </span>
          </div>
          <div className={styles.videoLink}>
            <Button href={videoLink ? undefined : `/videos/${result.slug}-${result.youtubeId}`}>
              Ver transcripción
            </Button>
          </div>
        </div>
      </VideoContainer>
      {result.subtitles?.map((subtitle, index) => (
        <SubtitleResult key={index} videoId={result.youtubeId} subtitle={subtitle} />
      ))}
    </div>
  );
}
