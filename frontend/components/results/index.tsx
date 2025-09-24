"use client";
import { useSearchContext } from "@/data/context";
import { getTitle } from "./utils";
import VideoList from "../video-list";

export default function Results() {
  const { searchOptions, searchResults, availableShows } = useSearchContext();

  if (!searchOptions.q) return null;

  const title = getTitle(searchOptions, searchResults, availableShows);

  return <VideoList videos={searchResults.results} title={title} videoLinks />;
}
