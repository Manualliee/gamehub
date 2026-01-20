"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { searchGames } from "@/actions/game"; // Import server action

interface SearchResult {
  id: number;
  name: string;
  background_image: string | null;
  released: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce logic: Only fetch if user stops typing for 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const response = await searchGames(query);
          if (response.success) {
            setResults(response.data.games.slice(0, 5));
            setShowDropdown(true);
          } else {
            console.error("Search failed:", response.error);
          }
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          placeholder="Search games..."
          className="w-full pl-10 pr-4 py-2.5 border border-accent/50 rounded-full transition-all duration-300 outline-none focus:ring-4 focus:ring-accent/10 placeholder:text-muted-foreground"
        />
      </form>

      {/* Live Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-6 flex justify-center items-center gap-2 text-muted-foreground text-sm">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((game) => (
                <li
                  key={game.id}
                  className="border-b border-border last:border-0"
                >
                  <Link
                    href={`/games/${game.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="relative w-12 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                      {game.background_image && (
                        <Image
                          src={game.background_image}
                          alt={game.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate text-foreground">
                        {game.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {game.released?.split("-")[0] || "N/A"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
              {/* "View all" link at the bottom */}
              <li className="bg-secondary">
                <button
                  onClick={handleSubmit}
                  className="w-full text-center p-3 text-xs text-accent hover:cursor-pointer hover:underline font-medium"
                >
                  View all results for &quot;{query}&quot;
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
