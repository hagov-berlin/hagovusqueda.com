"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchOptions, PaginatedSearchResults, Show } from "./types";
import { getSearchResults } from "./api-client";

type SearchData = {
  searchOptions: SearchOptions;
  searchResults?: PaginatedSearchResults;
  doSearch: (searchTerm: string, show: string) => void;
  availableShows: Show[];
};

const SearchContext = createContext<SearchData>({
  searchOptions: {
    q: "",
    showSlug: "",
  },
  doSearch: () => {},
  availableShows: [],
});

type SearchContextProps = {
  children: ReactNode;
  searchParams: Record<string, string>;
  availableShows: Show[];
};

function parsePageParam(paramValue?: string) {
  if (!paramValue) return 1;
  const parsedPage = Math.round(parseInt(paramValue, 10));
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  return page;
}

function urlWithQueryParams(q: string, show: string) {
  const params = new URLSearchParams();
  params.set("q", q);
  if (show) {
    params.set("show", show);
  }
  return `${window.location.pathname}?${params.toString()}`;
}

export function SearchContextProvider(props: SearchContextProps) {
  const { searchParams, availableShows, children } = props;

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    q: searchParams.q,
    showSlug: searchParams.show || "hay-algo-ahi",
    page: parsePageParam(searchParams.page),
  });

  const [searchResults, setSearchResults] = useState<PaginatedSearchResults>();

  const router = useRouter();

  const doSearch = (q: string, showSlug: string) => {
    const somethingHasChanged = q && (q !== searchOptions.q || showSlug !== searchOptions.showSlug);
    if (somethingHasChanged) {
      const newUrl = urlWithQueryParams(q, showSlug);
      router.push(newUrl, { scroll: false });
    }
  };

  useEffect(() => {
    setSearchOptions({
      q: searchParams.q,
      showSlug: searchParams.show,
      page: parsePageParam(searchParams.page),
    });
    setSearchResults(undefined);
  }, [searchParams.q, searchParams.show, searchParams.page]);

  useEffect(() => {
    if (!searchOptions.q) return;
    getSearchResults(searchOptions).then(async (newSearchResults) => {
      setSearchResults(newSearchResults);
    });
  }, [searchOptions]);

  return (
    <SearchContext.Provider value={{ searchOptions, searchResults, doSearch, availableShows }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  return useContext(SearchContext);
}
