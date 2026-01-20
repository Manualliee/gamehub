"use client";
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useState, useRef } from "react";
import Img from "next/image";

interface GameGalleryProps {
  screenshots: { id: number; image: string }[];
  gameName: string;
  trailerFile?: string | null;
  trailerPreview?: string | null;
}

export default function GameGallery({
  screenshots,
  gameName,
  trailerFile,
  trailerPreview,
}: GameGalleryProps) {
  const [activeMedia, setActiveMedia] = useState<string | "trailer" | null>(
    trailerFile
      ? "trailer"
      : screenshots.length > 0
      ? screenshots[0].image
      : null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Scroll Overflow Mask
  const left = `0%`;
  const right = `100%`;
  const leftInset = `20%`;
  const rightInset = `80%`;
  const transparent = `#0000`;
  const opaque = `#000`;

  const useScrollOverflowMask = (scrollXProgress: MotionValue<number>) => {
    // Initialize the mask to match the initial state of the scroll container
    // If it starts at 0, it should be fading the right side only
    const maskImage = useMotionValue(
      `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
    );

    useMotionValueEvent(scrollXProgress, "change", (value) => {
      // Use "nearly 0" and "nearly 1" to handle float precision issues
      if (value <= 0.01) {
        // At start: Fade RIGHT only
        animate(
          maskImage,
          `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
        );
      } else if (value >= 0.99) {
        // At end: Fade LEFT only
        animate(
          maskImage,
          `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
        );
      } else {
        // In middle: Fade BOTH
        animate(
          maskImage,
          `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
        );
      }
    });

    return maskImage;
  };

  const { scrollXProgress } = useScroll({ container: scrollRef });
  // Pass scrollXProgress directly, it is already a MotionValue
  const maskImage = useScrollOverflowMask(scrollXProgress);

  return (
    <div className="min-w-0 flex flex-col gap-2">
      {/* Main Display Area */}
      <div className="relative w-full aspect-video lg:h-[400px] rounded-lg overflow-hidden shrink-0 bg-black transition-all duration-300">
        {activeMedia === "trailer" && trailerFile ? (
          <video
            width="100%"
            height="100%"
            controls
            autoPlay
            src={trailerFile}
            className="w-full h-full object-cover bg-black"
            poster={trailerPreview || undefined}
          />
        ) : activeMedia && activeMedia !== "trailer" ? (
          <Img
            key={activeMedia}
            src={activeMedia}
            alt={gameName}
            fill
            className="object-cover animate-in fade-in duration-300"
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image Available
          </div>
        )}
      </div>

      {/* Thumbnails List */}

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-accent/50 hover:bg-accent/80 text-center text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-0"
          aria-label="Scroll Left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <motion.div
          ref={scrollRef}
          className="flex flex-row overflow-x-auto hide-scrollbar gap-4 snap-x snap-mandatory pb-2"
          style={{ maskImage }}
        >
          {/* Trailer Button */}
          {trailerFile && (
            <div
              onMouseEnter={() => setActiveMedia("trailer")}
              onClick={() => setActiveMedia("trailer")}
              className={`relative aspect-video w-60 sm:w-72 flex-none rounded-lg overflow-hidden snap-center cursor-pointer border-2 transition-all flex items-center justify-center bg-zinc-900 group ${
                activeMedia === "trailer"
                  ? "border-accent"
                  : "border-transparent hover:border-accent/50"
              }`}
            >
              {trailerPreview && (
                <Img
                  src={trailerPreview}
                  alt="Trailer Thumbnail"
                  fill
                  className="object-cover opacity-60"
                  sizes="(max-width: 640px) 240px, 300px"
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-foreground border-b-[8px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>
          )}

          {/* Screenshots Thumbnails */}
          {screenshots?.map((shot) => (
            <div
              key={shot.id}
              className={`relative aspect-video w-60 sm:w-72 flex-none rounded-lg overflow-hidden snap-center cursor-pointer border-2 transition-all ${
                activeMedia === shot.image
                  ? "border-accent"
                  : "border-transparent hover:border-accent/50"
              }`}
              onMouseEnter={() => setActiveMedia(shot.image)}
              onClick={() => setActiveMedia(shot.image)}
            >
              <Img
                src={shot.image}
                alt={`${gameName} screenshot`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 240px, 300px"
              />
            </div>
          ))}
        </motion.div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-accent/50 hover:bg-accent/80 text-center text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-0"
          aria-label="Scroll Right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
