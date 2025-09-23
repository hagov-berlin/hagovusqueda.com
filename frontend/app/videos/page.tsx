import Container from "@/components/container";
import VideoList from "@/components/video-list";
import { getVideos } from "@/data/api-client";

export default async function Videos() {
  const [videos] = await getVideos();

  return (
    <Container>
      <VideoList videos={videos} />
    </Container>
  );
}
