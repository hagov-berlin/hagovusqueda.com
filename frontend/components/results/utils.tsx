import { PaginatedSearchResults, SearchOptions, Show } from "@/data/types";

export function getTitle(
  searchOptions: SearchOptions,
  availableShows: Show[],
  searchResults?: PaginatedSearchResults
) {
  if (!searchResults) {
    return "Buscando...";
  }

  const showName =
    availableShows.find((show) => show.slug === searchOptions.showSlug)?.name ||
    searchOptions.showSlug;
  const showPart = searchOptions.showSlug ? `en ${showName}` : "";

  const quotedSearchTerm = <span>“{searchOptions.q}”</span>;
  const { totalCount } = searchResults[1];
  if (totalCount === 0) {
    return (
      <>
        No hay resultados para {quotedSearchTerm} {showPart}
      </>
    );
  }

  const videosCount = `${totalCount} ${totalCount === 1 ? "video" : "videos"}`;
  return (
    <>
      {videosCount} para {quotedSearchTerm} {showPart}
    </>
  );
}
