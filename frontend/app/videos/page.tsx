import Main from "@/components/containers/main";
import VideoList from "@/components/video-list";
import { getVideos } from "@/data/api-client";

export default async function Videos() {
  const [videos] = await getVideos();

  return (
    <Main>
      <VideoList videos={videos} />
    </Main>
  );
}
