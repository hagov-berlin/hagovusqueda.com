import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import VideoList from "@/components/video-list";
import VideoElement from "@/components/video";
import { getVideo, getVideos } from "@/data/api-client";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (/^\d+$/.test(slug)) {
    const page = parseInt(slug, 10);
    return { title: `HAGOVusqueda - Videos pagina ${page}` };
  }

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

async function Videos(props: { page: number }) {
  // TODO: duplicated component with app/videos/page.tsx
  const [videos, pagination] = await getVideos(props.page);

  return <VideoList videos={videos} pagination={pagination} videoLinks />;
}

type PageProps = {
  params: Promise<Record<string, string>>;
};

export default async function VideoOrPaginatedVideos({ params }: PageProps) {
  const { slug } = await params;
  if (/^\d+$/.test(slug)) {
    const page = parseInt(slug, 10);
    return <Videos page={page} />;
  }

  const videoId = slug.slice(-11);
  return <Video videoId={videoId} slug={slug} />;
}
