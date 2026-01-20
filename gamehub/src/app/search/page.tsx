import { RawgGame } from "@/types/game";
import { searchGames } from "@/actions/game";
import SearchResults from "@/components/search/SearchResults";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  if (!q) return <div className="p-8">No search query provided.</div>;

  let games: RawgGame[] = [];
  let totalCount = 0;

  try {
    const result = await searchGames(q);
    if (result.success) {
      games = result.data.games;
      totalCount = result.data.total;
    } else {
      console.error("Search failed:", result.error);
    }
  } catch (error) {
    console.error("Search Page Error:", error);
    return (
      <div className="p-8">Error fetching games. Please try again later.</div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Found {totalCount} results for{" "}
        <span className="text-accent">&quot;{q}&quot;</span>
      </h1>

      <SearchResults initialGames={games} query={q} totalCount={totalCount} />
    </div>
  );
}
