"use client";
import { useSearchContext } from "@/data/context";
import { getTitle } from "./utils";
import VideoList from "../video-list";

export default function Results() {
  const { searchOptions, searchResults, availableShows } = useSearchContext();

  if (!searchOptions.q) return null;

  const title = getTitle(searchOptions, availableShows, searchResults);

  return (
    <VideoList videos={searchResults?.[0] || []} pagination={searchResults?.[1]} title={title} />
  );
}
