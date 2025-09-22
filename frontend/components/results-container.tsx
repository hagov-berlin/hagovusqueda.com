import { Result, ShowString } from "@/data/types";
import VideoResult from "./video-result";
import styles from "./results-container.module.css";
import { useHagovSearchParams } from "./hooks";
import { AVAILABLE_SHOWS } from "@/data/shows";

function countSubtitles(results: Result[]) {
  const count = results.reduce((accum, result) => accum + result.subtitles.length, 0);
  return `${count} ${count === 1 ? "resultado" : "resultados"}`;
}

function countResults(results: Result[]) {
  return `${results.length} ${results.length === 1 ? "video" : "videos"}`;
}

function getTitle(
  loading: boolean,
  results: Result[],
  searchTerm: string,
  resultsCapped: boolean,
  show: ShowString
) {
  if (loading) {
    return "Buscando...";
  }
  const showName = AVAILABLE_SHOWS[show];
  const quotedSearchTerm = <span>“{searchTerm}”</span>;
  if (results.length === 0) {
    return (
      <>
        No hay resultados para {quotedSearchTerm} en {showName}
      </>
    );
  }
  const subtitlesCount = countSubtitles(results);
  const videosCount = countResults(results);
  if (resultsCapped) {
    return (
      <>
        Mas de {subtitlesCount} en {videosCount} para {quotedSearchTerm} en {showName}
      </>
    );
  }
  return (
    <>
      {subtitlesCount} en {videosCount} para {quotedSearchTerm} en {showName}
    </>
  );
}

type ResultsContainerProps = {
  loading: boolean;
  results: Result[];
  resultsCapped: boolean;
};

export default function ResultsContainer(props: ResultsContainerProps) {
  const { loading, results, resultsCapped } = props;

  const { searchTerm, show } = useHagovSearchParams();

  if (!searchTerm) return null;

  const title = getTitle(loading, results, searchTerm, resultsCapped, show);

  return (
    <div className={styles.results}>
      <h2 className={styles.title}>{title}</h2>
      {results?.map((result) => (
        <VideoResult key={result.youtubeId} result={result} />
      ))}
    </div>
  );
}
