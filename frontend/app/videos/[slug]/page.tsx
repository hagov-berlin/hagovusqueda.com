import { notFound } from "next/navigation";
import Container from "@/components/container";
import VideoList from "@/components/video-list";
import { getVideo, getVideos } from "@/data/api-client";

async function Video(props: { videoId: string }) {
  const video = await getVideo(props.videoId);

  if (!video) {
    notFound();
  }

  return <Container>{video.title}</Container>;
}

async function Videos(props: { page: number }) {
  // TODO: duplicated component with app/videos/page.tsx
  const [videos, pagination] = await getVideos(props.page);

  return (
    <Container>
      <VideoList videos={videos} pagination={pagination} />
    </Container>
  );
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
  return <Video videoId={videoId} />;
}
