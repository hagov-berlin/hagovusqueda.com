import { AVAILABLE_SHOWS } from "./shows";

export type Subtitle = {
  startTimeMs: number;
  endTimeMs: number;
  text: string;
};
export type VideoId = string;

export type Show = keyof typeof AVAILABLE_SHOWS;

export function isShow(showString: string): showString is Show {
  return !!Object.keys(AVAILABLE_SHOWS).find((show) => show === showString);
}

export type Video = {
  youtubeId: VideoId;
  title: string;
  date: string;
  show: Show;
  durationSec: number;
};

export type Result = Video & {
  subtitles: Subtitle[];
};

export type HagovSearchParams = {
  searchTerm: string;
  show: Show;
  dateFrom?: string;
  dateUntil?: string;
};

export type SearchResult = {
  results: Result[];
  resultsCapped: boolean;
};
