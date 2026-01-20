"use client";
import { AnimatePresence, motion } from "motion/react";
import { Skeleton } from "../ui/Skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import Img from "next/image";
import { calculatePrice } from "@/utilities/priceUtils";
import { platformIcons } from "@/constants/platformIcons";
import { getUniquePlatformKeys } from "@/utilities/platformUtils";
import { RawgGame, Screenshot } from "@/types/game";
import { getCarouselGames, getGameScreenshots } from "@/actions/game";

export default function Carousel() {
  const [game, setGame] = useState<RawgGame[]>([]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredShot, setHoveredShot] = useState<Screenshot | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getCarouselGames()
      .then((res) => {
        if (res.success) setGame(res.data);
      })
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  const hasData = game.length > 0;
  const safeIndex = hasData
    ? ((currentIndex % game.length) + game.length) % game.length
    : 0;
  const activeGame = hasData ? game[safeIndex] : null;
  const gameId = activeGame?.id;

  // Fetch screenshots when active game changes
  useEffect(() => {
    // If there's no active game ID, clear screenshots to avoid stale images
    if (!gameId) {
      setScreenshots([]);
      return;
    }

    setScreenshots([]); // Clear previous screenshots immediately to prevent mismatch

    const controller = new AbortController();

    (async () => {
      try {
        const result = await getGameScreenshots(gameId);
        if (result.success) {
          setScreenshots(result.data);
        } else {
          setScreenshots([]);
        }
      } catch (error) {
        console.error("Error fetching screenshots:", error);
        // Ignore abort errors; log others and clear to prevent stale UI
        if (controller.signal.aborted) return;
        setScreenshots([]);
      }
    })();
    // Abort request if component unmounts or gameId changes quickly
    return () => controller.abort();
  }, [gameId]);

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % game.length);
  };

  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + game.length) % game.length);
  };

  const goTo = (idx: number) => {
    if (game.length === 0) return;
    setCurrentIndex(idx);
  };

  // Autoplay every 5 seconds
  useEffect(() => {
    // Avoids scheduling a timer if there's no data
    if (game.length === 0) return;
    // Only autoplay if the document is visible
    if (
      typeof document !== "undefined" &&
      document.visibilityState !== "visible"
    ) {
      return;
    }
    // Pause when user is actively hovering/focusing interactive media
    if (isPaused) return;
    // Schedule the next slide change (every 5 seconds)
    const id = window.setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % game.length);
    }, 5000);
    // Cleanup timeout on unmount or when dependencies change
    return () => window.clearTimeout(id);
  }, [currentIndex, game.length, isPaused]);

  const price = activeGame ? calculatePrice(activeGame.released) : null;
  const currentlyAvailable = activeGame
    ? new Date().toISOString().split("T")[0] >= activeGame.released
    : false;
  const gamePlatforms = getUniquePlatformKeys(activeGame?.platforms);

  return (
    <div className="bg-card/40 relative w-[80%] mx-auto space-y-4 p-6 rounded-lg shadow-lg/50 backdrop-blur-sm border border-border/50">
      <div className="font-bold mb-4 text-2xl">
        {activeGame ? (
          <h2 className="text-shadow-lg/30">{activeGame.name}</h2>
        ) : (
          /* Loading skeletons */
          <Skeleton className="w-52 h-6 bg-muted/20 rounded-md animate-pulse" />
        )}
      </div>
      <div className="w-full h-full flex flex-row items-stretch justify-between max-lg:flex-col max-lg:gap-4">
        {activeGame ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGame.id}
              className="w-[50%] h-auto max-lg:w-full max-lg:mb-6 relative aspect-video overflow-hidden shadow-xl border border-border/20 hover:border-border/50 shadow-accent/40 hover:shadow-xl hover:shadow-accent/60 transition duration-300 rounded-md"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.28, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.24, ease: "easeIn" },
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            >
              <Link
                href={`/games/${activeGame.id}`}
                aria-label={`View details for ${activeGame.name}`}
                className="block relative w-full h-full"
              >
                <Img
                  src={activeGame.background_image}
                  alt={activeGame.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </Link>
              {/* Hover preview overlay */}
              <AnimatePresence>
                {hoveredShot && (
                  <motion.div
                    key={hoveredShot.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Img
                      src={hoveredShot.image}
                      alt={`${activeGame.name} screenshot preview`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Loading skeletons */
          <Skeleton className="w-[50%] max-lg:w-full aspect-video rounded-md" />
        )}

        {activeGame ? (
          <AnimatePresence mode="wait">
            <div className="flex flex-col justify-between w-[40%] max-lg:w-full max-lg:gap-4">
              <motion.div
                key={activeGame.id}
                className="grid grid-cols-2 gap-4 content-center max-lg:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.25 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {screenshots.length > 0
                  ? screenshots.slice(0, 4).map((shot) => (
                      <div
                        key={shot.id}
                        className="relative aspect-video w-full h-full overflow-hidden cursor-pointer shadow-xl shadow-accent/30 hover:shadow-xl hover:shadow-accent/50 border border-border/20 hover:border-border/50 transition duration-300 rounded-md"
                        onMouseEnter={() => {
                          setHoveredShot(shot);
                          setIsPaused(true);
                        }}
                        onMouseLeave={() => {
                          setHoveredShot(null);
                          setIsPaused(false);
                        }}
                        onFocus={() => {
                          setHoveredShot(shot);
                          setIsPaused(true);
                        }}
                        onBlur={() => {
                          setHoveredShot(null);
                          setIsPaused(false);
                        }}
                      >
                        <Img
                          src={shot.image}
                          alt={`${activeGame.name} screenshot`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      </div>
                    ))
                  : /* Screenshot Skeletons during fetch */
                    [...Array(4)].map((_, idx) => (
                      <Skeleton
                        key={idx}
                        className="relative aspect-video w-full h-full overflow-hidden bg-muted/20 rounded-md animate-pulse"
                      />
                    ))}
              </motion.div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-wrap items-center gap-2">
                  {gamePlatforms?.map((platform) => (
                    <span key={platform}>
                      {platformIcons[platform] || platform}
                    </span>
                  ))}
                </div>
                <div className="text-lg font-bold">
                  {currentlyAvailable
                    ? activeGame?.tba
                      ? "To Be Announced"
                      : price !== null
                      ? `$${price}`
                      : "N/A"
                    : activeGame?.tba
                    ? "To Be Announced"
                    : "Coming Soon"}
                </div>
              </div>
            </div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col justify-between w-[40%] max-lg:w-full max-lg:gap-4">
            <div className="grid grid-cols-2 gap-4 basis-2/5">
              {/* Loading skeletons */}
              {[...Array(4)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="relative aspect-video w-full h-full overflow-hidden bg-muted/20 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {game.length > 1 && (
        <div>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-accent/60 rounded-full px-3 py-2 hover:cursor-pointer hover:bg-accent/80 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent/60 rounded-full px-3 py-2 hover:cursor-pointer hover:bg-accent/80 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Pagination Markers */}
      {game.length > 1 && (
        <div className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {game.map((g, idx) => {
            // Ties the highlighted marker to the current slide
            const isActive = idx === safeIndex;
            return (
              <button
                key={g.id}
                type="button"
                aria-label={`Go to slide ${idx + 1}: ${g.name}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => goTo(idx)}
                className={
                  "h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-accent:ring-foreground/70 hover:cursor-pointer " +
                  (isActive
                    ? "w-5 bg-accent"
                    : "w-2.5 bg-accent/50 hover:bg-accent")
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
