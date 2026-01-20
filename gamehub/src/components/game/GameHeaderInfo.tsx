import React from "react";
import Img from "next/image";
import formatDate from "@/utilities/dateUtils";
import { GameDetail } from "@/types/game";
import GameRatingBar from "./GameRatingBar";

interface GameHeaderInfoProps {
  game: GameDetail;
}

export default function GameHeaderInfo({ game }: GameHeaderInfoProps) {
  return (
    <div className="h-full bg-card rounded-2xl p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
      {game.background_image && (
        <div className="relative aspect-video mb-2">
          <Img
            src={game.background_image}
            alt={`${game.name} background`}
            fill
            className="object-cover rounded-lg mb-4"
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
          />
        </div>
      )}
      <div className="flex flex-row justify-between">
        {game.rating !== undefined && (
          <div className="mb-2">
            <span className="font-semibold">Rating:</span>{" "}
            <span>{game.rating} / 5</span>
          </div>
        )}
        {game.reviews_text_count !== undefined && (
          <div className="mb-2">
            <span className="font-semibold">Reviews:</span>{" "}
            <span>{game.reviews_text_count} Reviews</span>
          </div>
        )}
      </div>

      <GameRatingBar ratings={game.ratings} />

      <div className="w-full h-full flex flex-col justify-center gap-2">
        <div className="flex flex-row flex-wrap justify-between">
          <span className="font-semibold">Release Date: </span>
          {game.released ? (
            <span>{formatDate(game.released)}</span>
          ) : game.tba ? (
            <span>To Be Announced</span>
          ) : (
            <span>Unknown</span>
          )}
        </div>
        <div className="flex flex-row flex-wrap justify-between">
          <span className="font-semibold">Developers:</span>
          <div className="flex flex-wrap gap-2">
            {(game.developers || []).slice(0, 2).map((dev) => (
              <span
                key={dev.id}
                className="border border-border bg-accent/50 rounded-xl px-2 py-0.5 text-xs text-foreground inline-block"
              >
                {dev.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-between">
          <span className="font-semibold">Publishers:</span>
          <div className="flex flex-wrap gap-2">
            {(game.publishers || []).map((pub) => (
              <span
                key={pub.id}
                className="border border-border bg-accent/50 rounded-xl px-2 py-0.5 text-xs text-foreground inline-block"
              >
                {pub.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-between">
          <span className="font-semibold">Genres:</span>
          <ul className="flex flex-wrap gap-1 mb-2">
            {game.genres.map((genre) => (
              <li
                key={genre.id}
                className="border border-border bg-accent/50 rounded-xl px-2 py-0.5 text-xs text-foreground inline-block"
              >
                {genre.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
