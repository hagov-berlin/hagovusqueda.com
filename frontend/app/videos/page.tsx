import { Metadata } from "next";
import VideoList from "@/components/video-list";
import { getVideos } from "@/data/api-client";

export default async function Videos() {
  // TODO: duplicated component with app/videos/[slug]/page.tsx
  const [videos, pagination] = await getVideos();

  return <VideoList videos={videos} pagination={pagination} videoLinks />;
}

export const metadata: Metadata = {
  title: "HAGOVusqueda - Videos",
};
