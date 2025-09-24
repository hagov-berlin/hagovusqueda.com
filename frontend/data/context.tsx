"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchOptions, SearchResults, Show, Video } from "./types";
import { getSearchResults } from "./api-client";

type SearchData = {
  searchOptions: SearchOptions;
  searchResults: SearchResults;
  doSearch: (searchTerm: string, show: string) => void;
  availableShows: Show[];
};

const SearchContext = createContext<SearchData>({
  searchOptions: {
    q: "",
    showSlug: "",
  },
  searchResults: {
    results: [],
    resultsCapped: false,
    loading: false,
  },
  doSearch: () => {},
  availableShows: [],
});

type SearchContextProps = {
  children: ReactNode;
  searchParams: Record<string, string>;
  availableShows: Show[];
};

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
  });

  const [searchResults, setSearchResults] = useState<SearchResults>({
    results: [],
    resultsCapped: false,
    loading: !!searchParams.q,
  });

  const router = useRouter();

  const doSearch = (q: string, showSlug: string) => {
    const somethingHasChanged = q && (q !== searchOptions.q || showSlug !== searchOptions.showSlug);
    if (somethingHasChanged) {
      setSearchOptions({ q, showSlug });
      const newUrl = urlWithQueryParams(q, showSlug);
      router.push(newUrl, { scroll: false });
    }
  };

  useEffect(() => {
    if (!searchOptions.q) return;
    setSearchResults({
      loading: true,
      results: [],
      resultsCapped: false,
    });
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
