"use client";
import VideoResult from "./video-result";
import styles from "./index.module.css";
import { useSearchContext } from "@/data/context";
import { Video } from "@/data/types";

function countSubtitles(results: Video[]) {
  const count = results.reduce((accum, result) => {
    return accum + (result.subtitles?.length || 0);
  }, 0);
  return `${count} ${count === 1 ? "resultado" : "resultados"}`;
}

function countResults(results: Video[]) {
  return `${results.length} ${results.length === 1 ? "video" : "videos"}`;
}

function getTitle(
  loading: boolean,
  results: Video[],
  searchTerm: string,
  resultsCapped: boolean,
  showName: string
) {
  if (loading) {
    return "Buscando...";
  }
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

export default function Results() {
  const { loading, results, resultsCapped, show, q } = useSearchContext();

  if (!q) return null;

  const title = getTitle(loading, results, q, resultsCapped, show);

  return (
    <div className={styles.results}>
      <h2 className={styles.title}>{title}</h2>
      {results?.map((result) => (
        <VideoResult key={result.youtubeId} result={result} />
      ))}
    </div>
  );
}
