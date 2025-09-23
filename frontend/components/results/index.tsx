"use client";
import { useSearchContext } from "@/data/context";
import { getTitle } from "./utils";
import VideoList from "../video-list";

export default function Results() {
  const { loading, results, resultsCapped, show, q } = useSearchContext();

  if (!q) return null;

  const title = getTitle(loading, results, q, resultsCapped, show);

  return <VideoList videos={results} title={title} />;
}
