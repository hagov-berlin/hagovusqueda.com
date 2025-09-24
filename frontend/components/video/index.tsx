import { Video } from "@/data/types";
import Container from "../container";
import YoutubeIframe from "./youtube-iframe";
import { parseDate, secondsToTime } from "./utils";
import styles from "./index.module.css";

type VideoElementProps = {
  video: Video;
};

export default function VideoElement(props: VideoElementProps) {
  const { video } = props;
  return (
    <Container>
      <YoutubeIframe videoId={video.youtubeId} />
      <h1>{video.title}</h1>
      <div>
        {video.channel.name}
        {" - "}
        <span>{parseDate(video.date)}</span>
      </div>
      <div className={styles.subtitlesContainer}>
        {video.subtitles?.map((subtitle) => (
          <div key={subtitle.order} className={styles.subtitleRow}>
            <span className={styles.subtitleTime}>{secondsToTime(subtitle.startTimeMs)}</span>
            <span>{subtitle.text}</span>
          </div>
        ))}
      </div>
    </Container>
  );
}
