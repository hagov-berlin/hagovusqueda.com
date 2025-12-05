import { Metadata } from "next";
import VideoList from "@/components/video-list";
import { getVideos } from "@/data/api-client";

type PageProps = { searchParams: Promise<Record<string, string>> };

async function getPageNumber(searchParams: PageProps["searchParams"]) {
  const pageValue = (await searchParams).page;
  if (!pageValue) return 1;
  const page = parseInt(pageValue, 10);
  if (isNaN(page) || page < 1) return 1;
  return page;
}

export default async function Videos(props: PageProps) {
  const page = await getPageNumber(props.searchParams);
  const [videos, pagination] = await getVideos(page);

  return <VideoList videos={videos} pagination={pagination} videoLinks />;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const page = await getPageNumber(props.searchParams);
  if (page !== 1) {
    return { title: `HAGOVusqueda - Videos pagina ${page}` };
  }

  return {
    title: "HAGOVusqueda - Videos",
  };
}
