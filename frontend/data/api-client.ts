import { Channel, Pagination, SearchOptions, SearchResults, Show, Video } from "./types";

type PaginatedVideos = [Video[], Pagination];

type RequestOptions = {
  path: string;
  params?: URLSearchParams;
};

const baseUrl = process.env.INTERNAL_BASE_API_PATH || process.env.NEXT_PUBLIC_BASE_API_PATH;

async function request<T>(options: RequestOptions): Promise<T> {
  const url = options.params
    ? `${baseUrl}${options.path}?${options.params.toString()}`
    : `${baseUrl}${options.path}`;
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
}

export async function getSearchResults(searchOptions: SearchOptions): Promise<SearchResults> {
  const params: URLSearchParams = new URLSearchParams();
  params.set("q", searchOptions.q);
  if (searchOptions.showSlug) {
    params.set("show", searchOptions.showSlug.toString());
  }
  return request({
    path: "/search",
    params,
  });
}

export async function getChannels(): Promise<Channel[]> {
  return request({
    path: "/channels",
  });
}

export async function getChannel(channelId: string): Promise<Channel> {
  return request({
    path: `/channels/${channelId}`,
  });
}

export async function getShows(): Promise<Show[]> {
  return request({
    path: "/shows",
  });
}

export async function getShow(showId: string): Promise<Show> {
  return request({
    path: `/shows/${showId}`,
  });
}

export async function getVideos(page?: number): Promise<PaginatedVideos> {
  let params: URLSearchParams | undefined = undefined;
  if (page) {
    params = new URLSearchParams();
    params.set("page", page.toString());
  }
  return request({
    path: "/videos",
    params,
  });
}

export async function getVideo(videoId: string): Promise<Video> {
  return request({
    path: `/videos/${videoId}`,
  });
}
