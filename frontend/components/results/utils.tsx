import { SearchOptions, SearchResults, Show, Video } from "@/data/types";

function countSubtitles(results: Video[]) {
  const count = results.reduce((accum, result) => {
    return accum + (result.subtitles?.length || 0);
  }, 0);
  return `${count} ${count === 1 ? "resultado" : "resultados"}`;
}

function countResults(results: Video[]) {
  return `${results.length} ${results.length === 1 ? "video" : "videos"}`;
}

export function getTitle(
  searchOptions: SearchOptions,
  searchResults: SearchResults,
  availableShows: Show[]
) {
  if (searchResults.loading) {
    return "Buscando...";
  }

  const showName =
    availableShows.find((show) => show.slug === searchOptions.showSlug)?.name ||
    searchOptions.showSlug;
  const showPart = searchOptions.showSlug ? `en ${showName}` : "";

  const quotedSearchTerm = <span>“{searchOptions.q}”</span>;
  if (searchResults.results.length === 0) {
    return (
      <>
        No hay resultados para {quotedSearchTerm} {showPart}
      </>
    );
  }

  const subtitlesCount = countSubtitles(searchResults.results);
  const videosCount = countResults(searchResults.results);
  if (searchResults.resultsCapped) {
    return (
      <>
        Mas de {subtitlesCount} en {videosCount} para {quotedSearchTerm} {showPart}
      </>
    );
  }
  return (
    <>
      {subtitlesCount} en {videosCount} para {quotedSearchTerm} {showPart}
    </>
  );
}
