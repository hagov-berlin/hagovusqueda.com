import { getVideos } from "@/data/api-client";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = 1;
  const pageSize = 50_000; // max amount of urls permitted
  const [videos] = await getVideos(page, pageSize);
  const baseUrl = "https://hagovusqueda.com";
  return videos.map((video) => ({
    url: `${baseUrl}/videos/${video.slug}-${video.youtubeId}`,
  }));
}
