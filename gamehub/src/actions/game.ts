"use server";

import {
  RawgGame,
  Screenshot,
  Achievement,
  GameDetail,
  GameTrailer,
} from "@/types/game";
import { ActionResponse } from "@/types/action";

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";

// Helper to standardise responses
function success<T>(data: T): ActionResponse<T> {
  return { success: true, data };
}

function failure<T>(error: string): ActionResponse<T> {
  console.error(error);
  return { success: false, error };
}

export async function getCarouselGames(): Promise<ActionResponse<RawgGame[]>> {
  if (!RAWG_API_KEY) return failure("RAWG_API_KEY is not defined");

  try {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setMonth(today.getMonth() - 4);
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + 8);

    const startStr = pastDate.toISOString().split("T")[0];
    const endStr = futureDate.toISOString().split("T")[0];

    const response = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=${startStr},${endStr}&ordering=-added&page=1&page_size=6`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok)
      throw new Error(`Failed to fetch carousel games: ${response.status}`);

    const data = await response.json();
    const results = data?.results || [];
    return success(filterGames(results).slice(0, 6) as RawgGame[]);
  } catch (error) {
    return failure(error instanceof Error ? error.message : "Unknown error");
  }
}

export async function getGameScreenshots(
  gameId: number
): Promise<ActionResponse<Screenshot[]>> {
  if (!RAWG_API_KEY) return failure("No API Key");

  try {
    const response = await fetch(
      `${RAWG_BASE_URL}/games/${gameId}/screenshots?key=${RAWG_API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) return failure("Failed to fetch screenshots");

    const data = await response.json();
    return success(data.results || []);
  } catch (error) {
    return failure(error instanceof Error ? error.message : "Unknown error");
  }
}

// Helper to filter NSFW content
function filterGames(games: RawgGame[]): RawgGame[] {
  const bannedTags = ["nsfw", "hentai", "erotic"];
  return games.filter((game) => {
    if (!game.achievements_count && (!game.tags || game.tags.length === 0))
      return false;
    if (game.tags && Array.isArray(game.tags)) {
      if (game.tags.some((tag) => bannedTags.includes(tag.slug))) return false;
    }
    return true;
  });
}

// Internal fetch helper (returns raw data, throws on error)
async function fetchGamesRaw(url: string): Promise<RawgGame[]> {
  if (!RAWG_API_KEY) throw new Error("No API Key");
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();
  return filterGames(data.results || []);
}

// Wrapper to standardise exported list actions
async function safeFetchGames(
  url: string
): Promise<ActionResponse<RawgGame[]>> {
  try {
    const games = await fetchGamesRaw(url);
    return success(games);
  } catch (error) {
    return failure(error instanceof Error ? error.message : "Fetch error");
  }
}

export async function getPopularGames(
  page = 1,
  pageSize = 20
): Promise<ActionResponse<RawgGame[]>> {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(today.getFullYear() - 2);

  const startStr = pastDate.toISOString().split("T")[0];
  const endStr = today.toISOString().split("T")[0];

  return safeFetchGames(
    `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=${startStr},${endStr}&ordering=-added,-rating&page=${page}&page_size=${pageSize}`
  );
}

export async function getTrendingGames(
  page = 1,
  pageSize = 20
): Promise<ActionResponse<RawgGame[]>> {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(today.getFullYear() - 6);

  const startStr = pastDate.toISOString().split("T")[0];
  const endStr = today.toISOString().split("T")[0];
  return safeFetchGames(
    `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=${startStr},${endStr}&ordering=-released,-rating&page=${page}&page_size=${pageSize}`
  );
}

export async function getRatedGames(
  page = 1,
  pageSize = 20
): Promise<ActionResponse<RawgGame[]>> {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(today.getFullYear() - 16);

  const startStr = pastDate.toISOString().split("T")[0];
  const endStr = today.toISOString().split("T")[0];

  return safeFetchGames(
    `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=${startStr},${endStr}&ordering=-rating&page=${page}&page_size=${pageSize}`
  );
}

export async function getRecentGames(
  page = 1,
  pageSize = 20
): Promise<ActionResponse<RawgGame[]>> {
  const today = new Date();
  const past = new Date();
  past.setFullYear(today.getFullYear() - 1);
  const start = past.toISOString().split("T")[0];
  const end = today.toISOString().split("T")[0];
  return safeFetchGames(
    `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=${start},${end}&ordering=-released&page=${page}&page_size=${pageSize}`
  );
}

export async function getUpcomingGames(
  page = 1,
  pageSize = 20
): Promise<ActionResponse<RawgGame[]>> {
  const today = new Date();
  const future = new Date();
  future.setFullYear(today.getFullYear() + 2);
  const start = today.toISOString().split("T")[0];
  const end = future.toISOString().split("T")[0];
  return safeFetchGames(
    `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=${start},${end}&ordering=released&page=${page}&page_size=${pageSize}`
  );
}

export async function getPlatformGames(
  category: string,
  page = 1,
  pageSize = 20
): Promise<ActionResponse<RawgGame[]>> {
  const PLATFORM_RULES: Record<string, string> = {
    pc: "&parent_platforms=1",
    playstation: "&parent_platforms=2",
    xbox: "&parent_platforms=3",
    nintendo: "&parent_platforms=7",
    linux: "&parent_platforms=6",
    mobile: "&parent_platforms=4,8&exclude_parents=1,2,3",
  };
  const platformQuery = PLATFORM_RULES[category.toLowerCase()] || "";
  return safeFetchGames(
    `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}${platformQuery}&ordering=-added&page=${page}&page_size=${pageSize}`
  );
}

export async function searchGames(
  query: string,
  page = 1,
  pageSize = 20
): Promise<ActionResponse<{ games: RawgGame[]; total: number }>> {
  if (!query || !RAWG_API_KEY) return success({ games: [], total: 0 });

  try {
    const res = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(
        query
      )}&page=${page}&page_size=${pageSize}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    return success({
      games: filterGames(data.results || []),
      total: data.count || 0,
    });
  } catch (error) {
    return failure(error instanceof Error ? error.message : "Search error");
  }
}

export async function getGameDetails(
  id: number
): Promise<ActionResponse<RawgGame | null>> {
  if (!RAWG_API_KEY) return failure("No API Key");
  try {
    const res = await fetch(
      `${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return failure("Game not found");
    const data = await res.json();
    return success(data);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Error fetching details"
    );
  }
}

export async function getGameAchievements(
  id: number
): Promise<ActionResponse<Achievement[]>> {
  if (!RAWG_API_KEY) return failure("No API Key");
  try {
    const res = await fetch(
      `${RAWG_BASE_URL}/games/${id}/achievements?page_size=100&key=${RAWG_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return failure("Failed to fetch achievements");
    const data = await res.json();
    return success(data.results || []);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Error fetching achievements"
    );
  }
}

export async function getGameTrailer(
  id: number
): Promise<ActionResponse<GameTrailer | null>> {
  if (!RAWG_API_KEY) return failure("No API Key");
  try {
    const res = await fetch(
      `${RAWG_BASE_URL}/games/${id}/movies?key=${RAWG_API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return success(null);
    const data = await res.json();
    if (!data || !data.results || data.results.length === 0)
      return success(null);
    const trailer = data.results[0];
    const file = trailer?.data
      ? trailer.data[480] ?? trailer.data.max ?? ""
      : "";
    const preview = trailer?.preview ?? "";
    const name = trailer?.name ?? "";
    return success({ file, preview, name });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Error fetching trailer"
    );
  }
}

export async function getFullGameDetails(
  id: number
): Promise<ActionResponse<GameDetail>> {
  if (!RAWG_API_KEY) return failure("No API Key");

  try {
    const gameRes = await getGameDetails(id);
    if (!gameRes.success || !gameRes.data) return failure("Game not found");
    const game = gameRes.data;

    const screenshotsPromise = fetch(
      `${RAWG_BASE_URL}/games/${id}/screenshots?key=${RAWG_API_KEY}`,
      { next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const genreIds = (game.genres ?? [])
      .slice(0, 2)
      .map((g) => g.id)
      .join(",");

    const suggestionsUrl =
      genreIds.length > 0
        ? `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&genres=${genreIds}&ordering=-added&page_size=6&exclude_additions=true&exclude_parents=true&exclude_game_series=true`
        : `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&ordering=-added&page_size=6&exclude_additions=true&exclude_parents=true&exclude_game_series=true`;

    const suggestionsPromise = fetch(suggestionsUrl, {
      next: { revalidate: 3600 },
    }).then((r) => r.json());

    const seriesPromise = fetch(
      `${RAWG_BASE_URL}/games/${id}/game-series?key=${RAWG_API_KEY}`,
      { next: { revalidate: 3600 } }
    ).then((r) => r.json());

    const achievementsPromise = getGameAchievements(game.id);

    const [screenshotsData, suggestionsData, seriesData, achievementsData] =
      await Promise.all([
        screenshotsPromise,
        suggestionsPromise,
        seriesPromise,
        achievementsPromise,
      ]);

    const screenshots = screenshotsData.results || [];
    const suggestedGames = (suggestionsData.results || []).filter(
      (g: RawgGame) => g.id !== game.id
    );
    const seriesGames = seriesData.results || [];

    const achievements =
      achievementsData.success && achievementsData.data
        ? achievementsData.data
        : [];

    const fullDetails: GameDetail = {
      ...game,
      screenshots,
      suggested_games: suggestedGames,
      description: game.description || game.description_raw || "",
      metacritic: game.metacritic?.toString() || null,
      website: game.website || null,
      tba: game.tba || false,
      dlcs: [],
      parent_games: game.parent_games || [],
      series_games: seriesGames,
      achievements: achievements,
      developers: game.developers || [],
      publishers: game.publishers || [],
    };

    return success(fullDetails);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Error fetching full details"
    );
  }
}
