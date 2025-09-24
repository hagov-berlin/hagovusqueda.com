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
