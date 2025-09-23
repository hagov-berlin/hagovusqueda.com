import Form from "@/components/form";
import Results from "@/components/results";
import Main from "@/components/containers/main";
import Top from "@/components/containers/top";
import { SearchContextProvider } from "@/data/context";

export default async function Home(props: { searchParams: Promise<Record<string, string>> }) {
  const params = await props.searchParams;
  return (
    <SearchContextProvider searchParams={params}>
      <Top>
        <Form />
      </Top>
      <Main>
        <Results />
      </Main>
    </SearchContextProvider>
  );
}
