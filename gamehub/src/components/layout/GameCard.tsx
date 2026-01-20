import Image from "next/image";
import { platformIcons } from "@/constants/platformIcons";
import { getUniquePlatformKeys } from "@/utilities/platformUtils";
import { RawgGame } from "@/types/game";

interface GameCardProps {
  game: RawgGame;
}

export default function GameCard({ game }: GameCardProps) {
  const gamePlatforms = getUniquePlatformKeys(game.platforms);

  return (
    <div className="w-full h-max bg-card rounded-xl overflow-hidden shadow-lg/60 mb-2 hover:border-border/50 hover:shadow-xl/80 transition duration-300 border border-border/20">
      <div key={game.id}>
        <div className="relative w-full mb-2 aspect-video">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">{game.name}</h2>
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
          <div className="flex flex-wrap items-center gap-2">
            {gamePlatforms?.map((platform) => (
              <span key={platform}>{platformIcons[platform] || platform}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
