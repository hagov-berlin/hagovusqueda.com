export type Pagination = {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
};

export type Subtitle = {
  order: number;
  startTimeMs: number;
  endTimeMs: number;
  text: string;
  videoId: number;
};

export type Video = {
  youtubeId: string;
  title: string;
  slug: string;
  durationSec: number;
  date: string;

  transcript?: string;
  subtitles?: Subtitle[];

  channel: {
    name: string;
    slug: string;
    youtubeId: string;
  };

  show: {
    name: string;
    slug: string;
  };
};

export type Show = {
  name: string;
  slug: string;

  channel: {
    name: string;
    slug: string;
    youtubeId: string;
  };
};

export type Channel = {
  name: string;
  slug: string;
  youtubeId: string;

  shows: {
    name: string;
    slug: string;
  }[];
};

export type SearchOptions = {
  q: string;
  showSlug: string;
  channelSlug?: string;
  page?: number;
};

export type PaginatedSearchResults = [Video[], Pagination];

export type Stats = {
  videoCount: number;
  showCount: number;
};
