import { useEffect, useState } from "react";
import { HagovSearchParams, isShow, Result } from "@/data/types";
import { useSearchParams } from "next/navigation";
import { defaultParams } from "./utils";

export function useHagovSearchParams(): HagovSearchParams {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("q") || "";

  const showString = searchParams.get("show");
  const show = showString && isShow(showString) ? showString : defaultParams.show;

  return { searchTerm, show };
}

export function useSearch() {
  const params = useHagovSearchParams();
  const { searchTerm, show } = params;
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(!!searchTerm);
  const [resultsCapped, setResultsCapped] = useState(!!searchTerm);

  useEffect(() => {
    if (searchTerm?.length > 0) {
      setResults([]);
      setResultsCapped(false);
      setLoading(true);
      const params = new URLSearchParams();
      params.set("q", searchTerm);
      params.set("show", show);
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_PATH}/search?${params.toString()}`).then(
        async (response) => {
          const searchResults = await response.json();
          console.log(searchResults);
          setResults(searchResults.results);
          setResultsCapped(searchResults.resultsCapped);
          setLoading(false);
        }
      );
    }
  }, [searchTerm, show]);

  return { results, loading, resultsCapped };
}
