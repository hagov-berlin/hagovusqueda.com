"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchOptions, SearchResults, Video } from "./types";
import { getSearchResults } from "./api-client";

type SearchData = SearchOptions &
  SearchResults & {
    loading: boolean;
    doSearch: (searchTerm: string, show: string) => void;
  };

const SearchContext = createContext<SearchData>({
  q: "",
  show: "",
  loading: false,
  results: [],
  resultsCapped: false,
  doSearch: () => {},
});

type SearchContextProps = {
  children: ReactNode;
  searchParams: Record<string, string>;
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
  const [q, setQ] = useState(props.searchParams.q);
  const [show, setShow] = useState(props.searchParams.show || "hay-algo-ahi");
  const [channel, setChannel] = useState(props.searchParams.canal); // TODO
  const [loading, setLoading] = useState(!!q);
  const [results, setResults] = useState<Video[]>([]);
  const [resultsCapped, setResultsCapped] = useState(false);
  const router = useRouter();

  const doSearch = (searchTerm: string, searchShow: string) => {
    const somethingHasChanged = searchTerm && (searchTerm !== q || searchShow !== show);
    if (somethingHasChanged) {
      setQ(searchTerm);
      setShow(searchShow);
      const newUrl = urlWithQueryParams(searchTerm, searchShow);
      router.push(newUrl, { scroll: false });
    }
  };

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setResults([]);
    setResultsCapped(false);
    getSearchResults({ q, show }).then(async (searchResults) => {
      setResults(searchResults.results);
      setResultsCapped(searchResults.resultsCapped);
      setLoading(false);
    });
  }, [q, show]);

  return (
    <SearchContext.Provider value={{ q, show, channel, results, loading, resultsCapped, doSearch }}>
      {props.children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  return useContext(SearchContext);
}
