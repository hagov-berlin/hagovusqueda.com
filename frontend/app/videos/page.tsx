import Container from "@/components/container";
import VideoList from "@/components/video-list";
import { getVideos } from "@/data/api-client";

export default async function Videos() {
  // TODO: duplicated component with app/videos/[slug]/page.tsx
  const [videos, pagination] = await getVideos();

  return (
    <Container>
      <VideoList videos={videos} pagination={pagination} />
    </Container>
  );
}
