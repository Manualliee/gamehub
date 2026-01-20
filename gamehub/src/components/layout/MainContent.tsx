"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { RawgGame } from "@/types/game";
import GameCard from "./GameCard";
import DropdownFilter from "./DropdownFilter";
import {
  getPopularGames,
  getTrendingGames,
  getRatedGames,
  getRecentGames,
  getUpcomingGames,
  getPlatformGames,
} from "@/actions/game";
import { Skeleton } from "../ui/Skeleton";

export default function MainContent() {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("popular");
  const isRequestInProgress = useRef(false);

  const fetchGames = useCallback(
    async (page: number, filter: string, append = false) => {
      if (isRequestInProgress.current) return; // Prevent concurrent requests

      isRequestInProgress.current = true; // Mark request as in progress
      setLoading(true);

      try {
        let result;

        switch (filter) {
          case "trending":
            result = await getTrendingGames(page);
            break;
          case "rating":
            result = await getRatedGames(page);
            break;
          case "recent":
            result = await getRecentGames(page);
            break;
          case "upcoming":
            result = await getUpcomingGames(page);
            break;
          case "mobile":
          case "pc":
          case "linux":
          case "playstation":
          case "xbox":
          case "nintendo":
            result = await getPlatformGames(filter, page);
            break;
          default:
            result = await getPopularGames(page);
        }

        if (result?.success) {
          const newGames = result.data;
          if (newGames.length === 0) {
            if (page === 1) setGames([]);
            setHasMore(false);
          } else {
            setGames((prev) => (append ? [...prev, ...newGames] : newGames));
            setHasMore(newGames.length > 0);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
        isRequestInProgress.current = false;
      }
    },
    []
  );

  // Initial fetch
  useEffect(() => {
    // Reset list when filter changes
    setGames([]);
    setCurrentPage(1);
    fetchGames(1, currentFilter, false);
  }, [currentFilter, fetchGames]);

  const handleFilterChange = (newFilter: string) => {
    setCurrentFilter(newFilter);
  };

  // Infinite Scroll with Intersection Observer
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchGames(nextPage, currentFilter, true);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, currentPage, currentFilter, fetchGames]);

  // Responsive column count
  // Hydration fix: only set column count on client
  const [columnCount, setColumnCount] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const getColumnCount = () => {
      if (window.innerWidth >= 1024) return 4; // lg
      if (window.innerWidth >= 768) return 3; // md
      if (window.innerWidth >= 640) return 2; // sm
      return 1;
    };
    // Initial column count depending on screen size
    setColumnCount(getColumnCount());
    // Mark as mounted to avoid hydration mismatch
    setMounted(true);
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", handleResize);
    // Remove resize listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Split games into columns
  const columns: RawgGame[][] = Array.from({ length: columnCount }, () => []);
  games.forEach((game, i) => {
    columns[i % columnCount].push(game);
  });

  // Avoid hydration mismatch: only render columns after mount
  return (
    <main className="w-[80%] flex flex-col justify-between items-center">
      {loading ? (
        <Skeleton className="w-47 h-10 bg-muted/20 rounded-xl animate-pulse" />
      ) : (
        <DropdownFilter
          onFilterChange={handleFilterChange}
          currentFilter={currentFilter}
        />
      )}
      <div className="flex gap-4 justify-center w-full">
        {mounted
          ? columns.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-4 flex-1 min-w-0 p-2">
                {col.map((game) => (
                  <Link key={game.id} href={`/games/${game.id}`}>
                    <GameCard game={game} />
                  </Link>
                ))}
              </div>
            ))
          : games.map((game) => <GameCard key={game.id} game={game} />)}
      </div>
      {/* Loading skeletons */}
      {loading && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="relative aspect-video w-full h-70 overflow-hidden bg-muted/20 rounded-md animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Sentinel for Infinite Scroll */}
      <div ref={observerTarget} className="h-10 w-full" />

      {!hasMore && (
        <div className="text-center py-4">No more games to load</div>
      )}
    </main>
  );
}
