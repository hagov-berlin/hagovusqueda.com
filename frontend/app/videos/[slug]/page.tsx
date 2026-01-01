import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import VideoElement from "@/components/video";
import { getVideo } from "@/data/api-client";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const videoId = slug.slice(-11);
  const video = await getVideo(videoId);

  if (!video) {
    return { title: "HAGOVusqueda - Video no encontrado" };
  }

  return {
    title: `HAGOVusqueda - ${video.title}`,
  };
}

async function Video(props: { videoId: string; slug: string }) {
  const video = await getVideo(props.videoId);

  if (!video) {
    notFound();
  }

  if (props.slug !== `${video.slug}-${video.youtubeId}`) {
    redirect(`/videos/${video.slug}-${video.youtubeId}`);
  }

  return <VideoElement video={video} />;
}

type PageProps = {
  params: Promise<Record<string, string>>;
};

export default async function VideoOrPaginatedVideos({ params }: PageProps) {
  const { slug } = await params;
  const videoId = slug.slice(-11);
  return <Video videoId={videoId} slug={slug} />;
}

export const dynamic = "force-static";
export const revalidate = 86400; // One day
