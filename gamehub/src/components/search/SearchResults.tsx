"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Img from "next/image";
import { platformIcons } from "@/constants/platformIcons";
import { getUniquePlatformKeys } from "@/utilities/platformUtils";
import { RawgGame } from "@/types/game";
import { searchGames } from "@/actions/game";

interface SearchResultsProps {
  initialGames: RawgGame[];
  query: string;
  totalCount: number;
}

export default function SearchResults({
  initialGames,
  query,
  totalCount,
}: SearchResultsProps) {
  const [games, setGames] = useState<RawgGame[]>(initialGames);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialGames.length < totalCount);
  
  // Use a ref to track if a request is already in progress to prevent duplicates
  const isRequestInProgress = useRef(false);

  const loadMoreGames = useCallback(async () => {
    if (loading || !hasMore || isRequestInProgress.current) return;
    
    setLoading(true);
    isRequestInProgress.current = true;

    try {
      const result = await searchGames(query, page);

      if (result.success) {
        const newGames = result.data.games;
        if (newGames.length > 0) {
          setGames((prev) => [...prev, ...newGames]);
          setPage((prev) => prev + 1);
        } else {
          setHasMore(false);
        }
      } else {
        console.error("Search failed:", result.error);
      }
    } catch (error) {
      console.error("Error loading more games:", error);
    } finally {
      setLoading(false);
      isRequestInProgress.current = false;
    }
  }, [loading, hasMore, page, query]);

  // Infinite Scroll with Intersection Observer
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreGames();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMoreGames]);

  if (games.length === 0) {
    return <p className="text-muted-foreground">No games found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="w-full h-max bg-card rounded-xl overflow-hidden shadow-lg/60 mb-2 hover:border-border/50 hover:shadow-xl/80 transition duration-300 border border-border/20"
          >
            <div className="relative w-full mb-2 aspect-video">
              {game.background_image ? (
                <Img
                  src={game.background_image}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2 line-clamp-1">
                {game.name}
              </h2>
              <ul className="flex flex-wrap gap-1 mb-2">
                {game.genres?.map((genre) => (
                  <li
                    key={genre.id}
                    className="border border-border bg-accent/50 rounded-xl px-2 py-0.5 text-[10px] inline-block"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                {getUniquePlatformKeys(game.platforms).map((platform) => (
                  <span key={platform} className="text-muted-foreground">
                    {platformIcons[platform] || platform}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Sentinel for Infinite Scroll */}
      <div ref={observerTarget} className="h-10 w-full mt-4 flex justify-center items-center">
        {loading && (
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
      
      {!hasMore && games.length > 0 && (
         <div className="text-center py-8 text-muted-foreground">End of results</div>
      )}
    </>
  );
}
