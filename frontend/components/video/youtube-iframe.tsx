import styles from "./youtube-iframe.module.css";

type YoutubeIframeProps = {
  videoId: string;
  start?: number;
  autoplay?: boolean;
};

export default function YoutubeIframe(props: YoutubeIframeProps) {
  const params: URLSearchParams = new URLSearchParams();
  if (props.start) {
    params.set("start", props.start.toString());
  }
  if (props.autoplay) {
    params.set("autoplay", "1");
  }
  return (
    <iframe
      className={styles.resultIframe}
      width="640"
      height="360"
      allow="autoplay"
      src={`https://www.youtube.com/embed/${props.videoId}?${params.toString()}`}
      frameBorder="0"
    ></iframe>
  );
}
