import React from "react";
import Link from "next/link";
import Img from "next/image";
import formatDate from "@/utilities/dateUtils";

interface GameItem {
  id: number;
  name: string;
  background_image: string | null;
  released?: string | null;
}

interface GameGridSectionProps {
  title: string;
  games: GameItem[];
  fallbackMessage?: string;
}

export default function GameGridSection({
  title,
  games,
  fallbackMessage,
}: GameGridSectionProps) {
  if (!games || games.length === 0) {
    if (fallbackMessage) {
      return (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <div className="w-full h-0.5 bg-linear-to-r from-accent to-background mb-4"></div>
          <p>{fallbackMessage}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <div className="w-full h-0.5 bg-linear-to-r from-accent to-background mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <Link
            href={`/games/${game.id}`}
            key={game.id}
            className="block group rounded-lg overflow-hidden shadow-lg/60 mb-2 hover:border-border/50 hover:shadow-xl/80 transition duration-300 border border-border/20"
          >
            <div className="relative aspect-video w-full bg-muted">
              {game.background_image ? (
                <Img
                  src={game.background_image}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div className="bg-card p-3">
              <h3 className="font-medium truncate text-foreground/60 group-hover:text-foreground transition-colors">
                {game.name}
              </h3>
              {game.released && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(game.released)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
