import { Metadata } from "next";
import Form from "@/components/form";
import Results from "@/components/results";
import FAQs from "@/components/common/faqs";
import { SearchContextProvider } from "@/data/context";
import { getShows } from "@/data/api-client";

export default async function Home(props: { searchParams: Promise<Record<string, string>> }) {
  const params = await props.searchParams;
  const shows = await getShows();

  return (
    <SearchContextProvider searchParams={params} availableShows={shows}>
      <Form />
      <Results />
      <FAQs />
    </SearchContextProvider>
  );
}

export async function generateMetadata(props: {
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const params = await props.searchParams;

  if (!params.q) {
    return {
      title: `HAGOVusqueda`,
    };
  }

  if (!params.show) {
    return {
      title: `HAGOVusqueda - "${params.q}"`,
    };
  }

  const shows = await getShows();
  const show = shows.find((show) => show.slug === params.show);
  const showPart = show ? `en ${show.name}` : "";
  return {
    title: `HAGOVusqueda - "${params.q}" ${showPart}`,
  };
}
