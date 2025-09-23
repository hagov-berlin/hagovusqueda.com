import Form from "@/components/form";
import Results from "@/components/results";
import FAQs from "@/components/common/faqs";
import { SearchContextProvider } from "@/data/context";

export default async function Home(props: { searchParams: Promise<Record<string, string>> }) {
  const params = await props.searchParams;
  return (
    <SearchContextProvider searchParams={params}>
      <Form />
      <Results />
      <FAQs />
    </SearchContextProvider>
  );
}
