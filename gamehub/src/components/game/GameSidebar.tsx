import React from "react";
import Link from "next/link";
import Img from "next/image";
import { GameDetail } from "@/types/game";
import trophy from "../../../public/trophy-material-7-svgrepo-com.svg";
import tag from "../../../public/tag-svgrepo-com.svg";
import metacriticLogo from "../../../public/Metacritic_logo.svg";

interface GameSidebarProps {
  game: GameDetail;
}

const getMetacriticColor = (score: number | null) => {
  if (score === null) return "bg-muted text-muted-foreground border-border";
  if (score >= 75) return "bg-green-500/10 text-green-500 border-green-500/20";
  if (score >= 50)
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  return "bg-red-500/10 text-red-500 border-red-500/20";
};

export default function GameSidebar({ game }: GameSidebarProps) {
  const metacriticScore = game.metacritic ? parseInt(game.metacritic) : null;
  const metacriticColorClass = getMetacriticColor(metacriticScore);

  return (
    <div className="flex flex-col mt-6 lg:mt-0">
      <div className="bg-card border border-border p-4 rounded-xl">
        <div className="flex flex-row items-center gap-2 mb-4">
          <Img src={trophy} alt="Achievements SVG" width={32} height={32} />
          <span className="font-semibold">Achievements</span>
        </div>
        <ul className="flex flex-wrap gap-1 mb-2 line-clamp-10">
          {game.achievements.slice(0, 4).map((achievement) => (
            <li
              key={achievement.id}
              className="border border-border bg-accent/50 overflow-hidden rounded-xl text-xs inline-block"
            >
              {achievement.image && (
                <div
                  className="relative w-24 h-24"
                  title={achievement.name}
                  aria-label={achievement.name}
                >
                  <Img
                    src={achievement.image}
                    alt={achievement.name}
                    fill
                    className="inline-block object-cover"
                    sizes="(max-width: 640px) 100vw, 240px"
                    priority
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
        <Link
          href={`/games/${game.id}/achievements`}
          className="text-sm underline hover:text-accent transition-colors duration-200"
        >
          View All {game.achievements.length} Achievements
        </Link>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl mt-4">
        <div className="flex flex-row items-center gap-2 mb-4">
          <Img src={tag} alt="Tags SVG" width={32} height={32} />
          <span className="font-semibold">Tags</span>
        </div>
        <ul className="flex flex-wrap gap-1 mb-2">
          {(game.tags?.length ?? 0) > 0 ? (
            (game.tags || []).map((tag) => (
              <li
                key={tag.id}
                className="border border-border bg-accent/50 rounded-xl px-2 py-0.5 text-xs text-foreground inline-block"
              >
                {tag.name}
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">No tags available</li>
          )}
        </ul>
      </div>

      {/* Metacritic Score */}
      <div className="mt-4 flex items-center justify-between p-3 bg-card rounded-xl border border-border">
        <div className="flex flex-col justify-center items-center">
          <Img
            src={metacriticLogo}
            alt="Metacritic Logo"
            width={160}
            height={90}
            className="object-contain"
            style={{ width: "auto", height: "auto" }}
          />
          {game.metacritic_url && (
            <a
              href={game.metacritic_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-accent transition-colors duration-200"
            >
              View on Metacritic
            </a>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-lg border font-bold ${metacriticColorClass}`}
        >
          {game.metacritic ?? "N/A"}
        </span>
      </div>
      {game.website && (
        <div className="mt-4 flex items-center justify-center p-3 bg-card rounded-xl border border-border">
          <a
            href={game.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline hover:text-accent transition-colors duration-200"
          >
            Visit Official Website
          </a>
        </div>
      )}
    </div>
  );
}
