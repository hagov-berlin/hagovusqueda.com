import { AVAILABLE_SHOWS } from "./shows";

export type Subtitle = {
  startTimeMs: number;
  endTimeMs: number;
  text: string;
};
export type VideoId = string;

export type ShowString = keyof typeof AVAILABLE_SHOWS;

export function isShow(showString: string): showString is ShowString {
  return !!Object.keys(AVAILABLE_SHOWS).find((show) => show === showString);
}

export type Video = {
  youtubeId: VideoId;
  title: string;
  slug: string;
  date: string;
  show: ShowString;
  durationSec: number;
};

export type Result = Video & {
  subtitles: Subtitle[];
};

export type HagovSearchParams = {
  searchTerm: string;
  show: ShowString;
  dateFrom?: string;
  dateUntil?: string;
};

export type SearchResult = {
  results: Result[];
  resultsCapped: boolean;
};

export type Channel = {
  slug: string;
  name: string;
  shows: Show[];
};

export type Show = {
  slug: string;
  name: string;
};
